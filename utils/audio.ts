class AudioService {
    private static instance: AudioService;
    private currentAudio: HTMLAudioElement | null = null;
    private currentUrl: string | null = null;

    private constructor() {
        // Private constructor for Singleton
    }

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    public play(url: string, loop: boolean = false): void {
        // Clean up previous audio if any
        this.stop();

        const audio = new Audio(url);
        audio.loop = loop;
        this.currentAudio = audio;
        this.currentUrl = url;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.warn("AudioService: Auto-play blocked or interrupted:", e);
            });
        }
    }

    public stop(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
            this.currentUrl = null;
        }
        // Also try to clean up window global if it somehow exists from previous attempts
        if ((window as any).__animeAlarmAudio) {
            (window as any).__animeAlarmAudio.pause();
            (window as any).__animeAlarmAudio = null;
        }
    }

    public isPlaying(): boolean {
        return !!this.currentAudio && !this.currentAudio.paused;
    }
}

export default AudioService.getInstance();
