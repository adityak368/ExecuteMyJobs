package handlers;

import io.socket.emitter.Emitter;

public interface IEventHandler extends Emitter.Listener {
		
	void emitMsg(Object obj);
}
