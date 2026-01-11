# 🔧 Troubleshooting Guide

## Installation Issues

### Problem: `npm install` fails
**Solution:**
1. Delete `node_modules` folder and `package-lock.json`
2. Clear npm cache: `npm cache clean --force`
3. Run `npm install` again
4. If still failing, check Node.js version: `node --version` (should be v18+)

### Problem: Server dependencies won't install
**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Server Issues

### Problem: "Cannot find module 'express'" or 'socket.io'
**Solution:**
1. Make sure you're in the `server` directory
2. Run `npm install` to install dependencies
3. Check that `server/package.json` has the dependencies

### Problem: Server won't start / "Port 3000 already in use"
**Solution:**
1. Find process using port 3000:
   - Windows: `netstat -ano | findstr :3000`
   - Mac/Linux: `lsof -i :3000`
2. Kill the process
3. Restart server

Alternatively, use different port:
```bash
PORT=4000 npm start
```
Then update `.env.local` with: `VITE_SERVER_URL=http://localhost:4000`

### Problem: "Cannot GET /api/health"
**Solution:**
1. Verify server is running (check terminal)
2. Check URL: `http://localhost:3000` (not 5173)
3. Look for errors in server terminal
4. Verify server.js is in the `server` directory

### Problem: Server crashes after starting
**Solution:**
1. Check error message in terminal
2. Ensure no syntax errors in `server/server.js`
3. Check that all dependencies are installed
4. Try restarting: `npm start`

## Frontend Issues

### Problem: "Connection refused" error in console
**Solution:**
1. Verify server is running on port 3000
2. Check `VITE_SERVER_URL` in `.env.local`
3. Restart frontend: `npm run dev`
4. Look for CORS errors in browser console

### Problem: "Cannot connect to server" message in UI
**Solution:**
1. Confirm server is running: `cd server && npm start`
2. Check firewall isn't blocking localhost connections
3. Verify no typos in `.env.local`
4. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R)

### Problem: WebSocket connection fails
**Solution:**
1. Check browser console (F12 → Network tab)
2. Look for "Failed to establish WebSocket connection"
3. Verify server has Socket.IO enabled
4. Check for CORS issues
5. Try restarting both server and frontend

### Problem: "Module not found: socket.io-client"
**Solution:**
```bash
npm install socket.io-client
npm run dev
```

## Game Issues

### Problem: Can't create a game
**Solution:**
1. Check browser console for errors
2. Verify server is responding: Open `http://localhost:3000/api/health`
3. Check server logs for errors
4. Try refreshing the page

### Problem: Can't join a game
**Solution:**
1. Verify game ID is correct
2. Ensure game isn't already full (both colors occupied)
3. Check server logs for join errors
4. Try creating a new game instead

### Problem: Moves aren't syncing between players
**Solution:**
1. Check WebSocket connection (Network tab)
2. Verify both players are in same game
3. Check console for error messages
4. Restart frontend and try again
5. Check server logs for move errors

### Problem: Board state is inconsistent
**Solution:**
1. Refresh both browser windows
2. Rejoin the game
3. Create a new game and start fresh
4. Check that server hasn't crashed

### Problem: "Game not found" error
**Solution:**
1. Verify game ID is correct
2. Check that game hasn't been deleted (server restart)
3. Try creating a new game
4. Share the new game URL with opponent

## Network Issues

### Problem: Opponent sees different board state
**Solution:**
1. Check internet connection stability
2. Look for latency issues (slow network)
3. Verify both clients have same game ID
4. Restart both clients
5. Create a new game

### Problem: Game disconnects frequently
**Solution:**
1. Check internet connection quality
2. Restart WiFi router
3. Try wired connection instead of WiFi
4. Check server stability (logs)
5. Look for network errors in console

## Deployment Issues

### Problem: "Cannot connect to server" in production
**Solution:**
1. Verify production server URL is correct
2. Check VITE_SERVER_URL environment variable
3. Verify server is deployed and running
4. Check CORS settings on server
5. Check firewall/network policies

### Problem: Game doesn't persist after refresh
**Solution:**
This is expected - games are in-memory. Add database to persist:
- MongoDB
- PostgreSQL
- Firebase Realtime Database

### Problem: Too many connections / Server overload
**Solution:**
1. Implement connection limits
2. Add rate limiting
3. Scale to multiple servers
4. Use load balancer
5. Monitor server metrics

## Browser-Specific Issues

### Chrome: Game works fine

### Firefox: Game works fine

### Safari: 
- Ensure WebSocket is enabled
- Try private browsing mode
- Update to latest version

### Edge:
- Works like Chrome
- Check if blocking popups/notifications

## Mobile Issues

### Problem: Touch controls not working
**Solution:**
1. Ensure device is not in landscape-only mode
2. Try portrait orientation
3. Check browser touch support
4. Update browser to latest version

### Problem: Board too small on mobile
**Solution:**
Responsive design handles this automatically:
- Zoom out if needed (pinch zoom)
- Portrait orientation recommended
- Larger devices work better

## Performance Issues

### Problem: Game is laggy/slow
**Solution:**
1. Check network latency (should be <100ms)
2. Close other tabs/applications
3. Check CPU usage (might be browser lag)
4. Verify server isn't overloaded
5. Restart browser and server

### Problem: Moves have delay
**Solution:**
1. Check internet speed
2. Reduce network congestion
3. Move closer to WiFi router
4. Check server response time
5. Monitor for packet loss

## Security Issues

### Problem: Anyone can join my game
**Solution:**
This is expected for MVP. To fix:
1. Add password protection
2. Add friend list system
3. Add authentication
4. Use private game codes

## Other Issues

### Problem: "Unexpected token" or syntax errors
**Solution:**
1. Check for typos in code
2. Verify file endings (CRLF vs LF)
3. Check Node.js version compatibility
4. Look at full error message

### Problem: File not found errors
**Solution:**
1. Verify file paths are correct
2. Check capitalization (Windows is case-insensitive, Linux isn't)
3. Ensure files exist in right directories
4. Check file permissions

### Problem: Cannot find port binding
**Solution:**
1. Ensure Node.js is installed correctly
2. Try different port
3. Restart computer
4. Check system resources

## Getting Help

1. **Check Logs:**
   - Server terminal output
   - Browser console (F12)
   - Network tab (F12 → Network)

2. **Check Files:**
   - Verify file exists and in right location
   - Check syntax errors
   - Look for typos in URLs/IDs

3. **Restart Everything:**
   - Close all terminals
   - Refresh browsers
   - Start fresh: `npm start` (server) then `npm run dev` (frontend)

4. **Common Fixes:**
   - Clear cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`
   - Restart computer

5. **Debug Mode:**
   - Check browser console for errors
   - Check server terminal for errors
   - Monitor Network tab in DevTools
   - Add console.log() statements

---

**If all else fails:**
1. Delete server/node_modules and package-lock.json
2. Delete root node_modules and package-lock.json
3. Run setup script again
4. Start fresh with new game

Remember: Most issues are network or configuration related! 🔍
