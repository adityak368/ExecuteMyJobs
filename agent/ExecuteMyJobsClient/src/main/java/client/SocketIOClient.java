package client;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.logging.Logger;

import handlers.IEventHandler;
import handlers.SocketIOClientConnectedHandler;
import handlers.SocketIOClientDisconnectedHandler;
import handlers.SocketIOClientErrorHandler;
import handlers.SocketIOClientExceptionHandler;
import handlers.SocketIOClientPauseJobHandler;
import handlers.SocketIOClientStartJobHandler;
import handlers.SocketIOClientStatusHandler;
import handlers.SocketIOClientStopJobHandler;
import io.socket.client.IO;
import io.socket.client.IO.Options;
import io.socket.client.Socket;

public class SocketIOClient {

	private static Socket mSocket;
	private String mUrl;
	private static HashMap<String, IEventHandler> eventHandlerMap;
	private static final Logger mLogger = Logger.getLogger(SocketIOClient.class.getName());
	private ConfigLoader mConfigsLoader;
	
	public SocketIOClient(String url, Options opts, ConfigLoader configsLoader) {
		// TODO Auto-generated constructor stub
		this.mUrl = url;
		try {
			mSocket = IO.socket(url,opts);
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.mConfigsLoader = configsLoader;
		eventHandlerMap = new HashMap<>();
		initHandlers();
		initSocketWithHandlers();
	}
	
	private void initSocketWithHandlers() {
		// TODO Auto-generated method stub
		for(String key: eventHandlerMap.keySet()) {
			mSocket.on(key, eventHandlerMap.get(key));
		}
	}

	private void initHandlers() {
		//connection handlers
		eventHandlerMap.put(Socket.EVENT_CONNECT, new SocketIOClientConnectedHandler(mSocket,mConfigsLoader,Socket.EVENT_CONNECT));
		eventHandlerMap.put(Socket.EVENT_DISCONNECT, new SocketIOClientDisconnectedHandler(mSocket,Socket.EVENT_DISCONNECT));
		eventHandlerMap.put(Socket.EVENT_ERROR, new SocketIOClientErrorHandler(mSocket,Socket.EVENT_ERROR));
		eventHandlerMap.put(EventDefs.EXCEPTION, new SocketIOClientExceptionHandler(mSocket,EventDefs.EXCEPTION));
		
		//job handlers
		eventHandlerMap.put(EventDefs.START_JOB, new SocketIOClientStartJobHandler(mSocket,mConfigsLoader,EventDefs.START_JOB));
		eventHandlerMap.put(EventDefs.STOP_JOB, new SocketIOClientStopJobHandler(mSocket,mConfigsLoader,EventDefs.STOP_JOB));
		eventHandlerMap.put(EventDefs.PAUSE_JOB, new SocketIOClientPauseJobHandler(mSocket,mConfigsLoader,EventDefs.PAUSE_JOB));
		
		//status handlers
		eventHandlerMap.put(EventDefs.STATUS, new SocketIOClientStatusHandler(mSocket,mConfigsLoader,EventDefs.STATUS));
	}

	public void connect() {
		mLogger.info("Connecting to "+mUrl);
		mSocket.connect();
	}
	
	public IEventHandler getHandler(String eventId) {
		return eventHandlerMap.get(eventId);
	}
}
