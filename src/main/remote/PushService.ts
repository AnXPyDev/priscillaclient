import IntegrityEvent from "@/integrity/IntegrityEvent";
import Server from "@/remote/Server";

export interface PushServiceConfiguration {
	type?: string
	push_interval?: number
}

export default abstract class PushService {
	abstract start(): void;
	abstract stop(): void;
	abstract pushState(state: object): Promise<any>;
	abstract pushEvent(event: IntegrityEvent): Promise<any>;
}

export class UnifiedPushService extends PushService {
	server: Server;
	delay: number;
	events: IntegrityEvent[];
	state: object | null;
	running: boolean;

	constructor(server: Server, configuration: PushServiceConfiguration) {
		super()
		this.server = server;
		this.delay = configuration.push_interval ?? 5000;
		this.events = [];
		this.state = null;
		this.running = false;
	}

	start() {
		this.running = true;
		this.eventLoop();
	}
	stop() {
		this.running = false;
		this.unifiedpush();
	}

	async eventLoop() {
		await new Promise((resolve) => setTimeout(resolve, this.delay));
		while (this.running) {
			try {
				await this.unifiedpush();
			} catch(e) {
				console.error(e);
			}
			await new Promise((resolve) => setTimeout(resolve, this.delay));
		}
    }

	async unifiedpush() {
		let bundle: object = {};
		if (this.state != null) {
			bundle["state"] = JSON.stringify(this.state);
			this.state = null;
		}

		if (this.events.length > 0) {
			bundle["events"] = this.events.map((data) => JSON.stringify(data));
			this.events = [];
		}

		if (Object.keys(bundle).length === 0) {
			return;
		}

		//console.log("unified", "push", bundle);
		return await this.server.post("/client/unifiedpush", bundle);
	}

	async pushEvent(event: IntegrityEvent) {
		this.events.push(event);
	}

	async pushState(state: object) {
		this.state = state;
	}
}

export class RealtimePushService extends PushService {
	server: Server;
	
	// @ts-expect-error
	constructor(server: Server, configuration: PushServiceConfiguration) {
		super()
		this.server = server;
	}

	start() {}
	stop() {}

	pushEvent(event: IntegrityEvent) {
		console.log("realtime", "pushevent", event);
		return this.server.post("/client/pushevent", { data: JSON.stringify(event) });
	}

	pushState(state: object) {
		console.log("realtime", "pushstate", state);
		return this.server.post("/client/pushstate", { state: JSON.stringify(state) });
	}
}
