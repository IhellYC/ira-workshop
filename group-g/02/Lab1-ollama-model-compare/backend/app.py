"""
Ollama 模型对比助手 - Flask 后端
支持同时触发多个模型进行流式对话
"""
import json
import os
import threading
from queue import Queue
from typing import Dict, List
from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from ollama_service import ollama_service

app = Flask(__name__)
CORS(app)

# 存储对话历史（内存存储，仅用于演示）
conversation_history: Dict[str, List[Dict[str, str]]] = {}


@app.route("/api/health", methods=["GET"])
def health():
    """健康检查接口"""
    is_healthy = ollama_service.health_check()
    return jsonify({
        "ok": is_healthy,
        "ollama_host": ollama_service.host,
        "message": "Ollama 服务可用" if is_healthy else "Ollama 服务不可用"
    })


@app.route("/api/models", methods=["GET"])
def list_models():
    """获取 Ollama 可用模型列表"""
    try:
        models = ollama_service.list_models()
        return jsonify({
            "ok": True,
            "models": models,
            "count": len(models)
        })
    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500


@app.route("/api/chat/stream", methods=["POST"])
def chat_stream():
    """
    流式对话接口（单模型）
    
    请求体:
    {
        "model": "模型名称",
        "messages": [{"role": "user", "content": "..."}],
        "conversation_id": "可选，对话ID",
        "temperature": 0.7,
        "top_p": 0.9
    }
    """
    data = request.get_json()
    model = data.get("model")
    messages = data.get("messages", [])
    conversation_id = data.get("conversation_id")
    generate_kwargs = {
        "temperature": data.get("temperature", 0.7),
        "top_p": data.get("top_p", 0.9),
    }
    
    if not model:
        return jsonify({"ok": False, "error": "缺少模型名称"}), 400
    
    if not messages:
        return jsonify({"ok": False, "error": "缺少对话消息"}), 400
    
    def generate():
        """生成器函数，用于流式响应"""
        try:
            for chunk in ollama_service.chat_stream(model, messages, **generate_kwargs):
                yield f"data: {chunk}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": True, "message": str(e)})
            yield f"data: {error_data}\n\n"
    
    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.route("/api/chat/multi-stream", methods=["POST"])
def chat_multi_stream():
    """
    多模型并行流式对话接口
    
    请求体:
    {
        "models": ["模型1", "模型2", ...],
        "messages": [{"role": "user", "content": "..."}],
        "conversation_id": "可选，对话ID",
        "temperature": 0.7,
        "top_p": 0.9
    }
    
    响应格式（Server-Sent Events）:
    event: model_start
    data: {"model": "llama2"}
    
    event: chunk
    data: {"model": "llama2", "content": "Hello"}
    
    event: model_done
    data: {"model": "llama2", "total_duration": 1234}
    
    event: all_done
    data: {}
    """
    data = request.get_json()
    models = data.get("models", [])
    messages = data.get("messages", [])
    conversation_id = data.get("conversation_id")
    generate_kwargs = {
        "temperature": data.get("temperature", 0.7),
        "top_p": data.get("top_p", 0.9),
    }
    
    if not models:
        return jsonify({"ok": False, "error": "缺少模型列表"}), 400
    
    if not messages:
        return jsonify({"ok": False, "error": "缺少对话消息"}), 400
    
    # 使用队列收集各个模型的流式输出
    output_queue = Queue()
    active_models = len(models)
    
    def model_worker(model_name: str):
        """每个模型的独立工作线程"""
        try:
            output_queue.put({
                "event": "model_start",
                "data": {"model": model_name}
            })
            
            for chunk_str in ollama_service.chat_stream(model_name, messages, **generate_kwargs):
                try:
                    chunk = json.loads(chunk_str.strip())
                    # 提取实际内容
                    if "message" in chunk and "content" in chunk["message"]:
                        output_queue.put({
                            "event": "chunk",
                            "data": {
                                "model": model_name,
                                "content": chunk["message"]["content"]
                            }
                        })
                    elif "error" in chunk:
                        output_queue.put({
                            "event": "error",
                            "data": {
                                "model": model_name,
                                "message": chunk.get("message", "未知错误")
                            }
                        })
                except json.JSONDecodeError:
                    continue
            
            output_queue.put({
                "event": "model_done",
                "data": {"model": model_name}
            })
        except Exception as e:
            output_queue.put({
                "event": "error",
                "data": {
                    "model": model_name,
                    "message": str(e)
                }
            })
            output_queue.put({
                "event": "model_done",
                "data": {"model": model_name}
            })
    
    def generate():
        """生成器函数，从队列中读取并输出"""
        nonlocal active_models
        
        # 启动所有模型的工作线程
        threads = []
        for model in models:
            thread = threading.Thread(target=model_worker, args=(model,), daemon=True)
            thread.start()
            threads.append(thread)
        
        # 从队列中读取并输出
        while active_models > 0:
            try:
                item = output_queue.get(timeout=30)
                
                # 发送事件
                yield f"event: {item['event']}\n"
                yield f"data: {json.dumps(item['data'])}\n\n"
                
                # 检查是否所有模型都已完成
                if item["event"] == "model_done":
                    active_models -= 1
            except:
                # 超时，结束生成
                break
        
        # 等待所有线程完成
        for thread in threads:
            thread.join(timeout=5)
        
        # 发送完成事件
        yield f"event: all_done\ndata: {{}}\n\n"
    
    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.route("/api/conversation/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id: str):
    """获取对话历史"""
    history = conversation_history.get(conversation_id, [])
    return jsonify({
        "ok": True,
        "conversation_id": conversation_id,
        "history": history
    })


@app.route("/api/conversation/<conversation_id>", methods=["DELETE"])
def clear_conversation(conversation_id: str):
    """清空对话历史"""
    if conversation_id in conversation_history:
        del conversation_history[conversation_id]
    return jsonify({"ok": True, "message": "对话历史已清空"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5008"))
    print(f"🚀 Ollama 模型对比助手启动于 http://127.0.0.1:{port}")
    print(f"📡 Ollama 服务地址: {ollama_service.host}")
    app.run(host="0.0.0.0", port=port, debug=True, threaded=True)
