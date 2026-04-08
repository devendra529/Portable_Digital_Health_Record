#!/bin/bash
echo "🏥 Starting Scanly..."

# Start backend
cd backend
npm install --quiet &
BACKEND_PID=$!
wait $BACKEND_PID
node server.js &
echo "✅ Backend started on port 5000"

# Start frontend
cd ../frontend
npm install --quiet &
FRONTEND_PID=$!
wait $FRONTEND_PID
npm run dev &
echo "✅ Frontend started on port 3000"

echo ""
echo "🎉 Scanly is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Demo login: admin@scanly.app / admin123"
