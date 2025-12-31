# كيفية تشغيل خادم RAG

## المشكلة
ترى الرسالة: "خدمة التمارين الذكية غير متاحة حالياً. تأكد من تشغيل خادم RAG."

## الحل: تشغيل الخادم

### الخطوة 1: الانتقال إلى مجلد RAG

```bash
cd el-bayan-Hamza-rag-ocr
```

### الخطوة 2: تشغيل الخادم

```bash
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 --reload
```

### الخطوة 3: التحقق من أن الخادم يعمل

يجب أن ترى:
```
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Application startup complete.
```

### الخطوة 4: اختبار الخادم

في نافذة terminal أخرى:
```bash
curl http://localhost:8001/health
```

يجب أن ترى:
```json
{"status":"healthy","indexed":true,"num_documents":<number>}
```

## إذا كان المنفذ 8001 مستخدماً

### إيقاف العملية القديمة:

```bash
# إيجاد العملية
lsof -ti:8001

# إيقافها (استبدل <PID> برقم العملية)
kill <PID>

# أو إيقاف جميع عمليات Python على المنفذ
kill $(lsof -ti:8001)
```

ثم أعد تشغيل الخادم.

## إذا لم تكن المكتبات مثبتة

```bash
cd el-bayan-Hamza-rag-ocr
pip install -r rag_requirements.txt
```

## تشغيل الخادم في الخلفية (اختياري)

إذا أردت تشغيله في الخلفية:

```bash
cd el-bayan-Hamza-rag-ocr
nohup python -m uvicorn backend.api:app --host 127.0.0.1 --port 8001 > rag_server.log 2>&1 &
```

## التحقق من السجلات

إذا استخدمت nohup:
```bash
tail -f rag_server.log
```

## ملاحظات

- الخادم يجب أن يعمل على `http://127.0.0.1:8001`
- الواجهة الأمامية متصلة تلقائياً بهذا العنوان
- إذا غيرت المنفذ، يجب تحديث `VITE_RAG_API_URL` في `.env.local`

## بعد تشغيل الخادم

1. انتظر حتى ترى "Application startup complete"
2. افتح صفحة Lessons في المتصفح
3. يجب أن تختفي الرسالة وتظهر التمارين الذكية

