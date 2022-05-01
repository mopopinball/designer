import { EditingSession } from "./editing-session";

export interface SessionSummary {
    id: string;
    hardwareName: string;
    gameName: string;
}

export class AvailableEditingSessions {
    sessionSummaries: SessionSummary[] = [];

    constructor() {
        this.sessionSummaries = JSON.parse(localStorage.getItem('mopo-sessions')) || [];
    }

    load(sessionId: string): EditingSession {
        return JSON.parse(localStorage.getItem(`mopo-session-${sessionId}`));
    }

    save(session: EditingSession): void {
        localStorage.setItem('mopo-sessions', JSON.stringify(this.sessionSummaries));

        localStorage.setItem(`mopo-session-${session.id}`, JSON.stringify(session));
    }
}
