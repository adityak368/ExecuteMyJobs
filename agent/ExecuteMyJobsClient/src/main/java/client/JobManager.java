package client;

public class JobManager {
	private static JobManager mJobmanager;
	
	public static synchronized JobManager getInstance() {
			if(mJobmanager==null) {
				mJobmanager = new JobManager();
			}
		return mJobmanager;
	}
	
	boolean isBusy = false;
	
	private JobManager() {
		
	}

	public boolean isBusy() {
		return isBusy;
	}

	public synchronized void setBusy(boolean isBusy) {
		this.isBusy = isBusy;
	}
	
}
