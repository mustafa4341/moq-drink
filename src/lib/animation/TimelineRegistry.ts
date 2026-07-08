import gsap from "gsap";

class TimelineRegistry {
  private timelines: Map<string, gsap.core.Timeline> = new Map();

  public register(id: string, timeline: gsap.core.Timeline) {
    // If a timeline with the same key exists, clean it up first
    this.unregister(id);
    this.timelines.set(id, timeline);
  }

  public get(id: string): gsap.core.Timeline | undefined {
    return this.timelines.get(id);
  }

  public unregister(id: string) {
    const tl = this.timelines.get(id);
    if (tl) {
      tl.kill();
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      this.timelines.delete(id);
    }
  }

  public killAll() {
    this.timelines.forEach((tl) => {
      tl.kill();
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    });
    this.timelines.clear();
  }
}

export const timelineRegistry = new TimelineRegistry();
