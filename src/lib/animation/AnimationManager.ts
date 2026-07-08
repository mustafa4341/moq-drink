import { timelineRegistry } from "./TimelineRegistry";
import { QualityProfile, QualityProfiles } from "./MotionConfig";

class AnimationManager {
  private currentProfile: "mobile" | "tablet" | "desktop" = "desktop";
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.detectDeviceProfile();
    
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleResize);
    }
  }

  public destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.handleResize);
    }
    timelineRegistry.killAll();
    this.isInitialized = false;
  }

  private handleResize = () => {
    const oldProfile = this.currentProfile;
    this.detectDeviceProfile();
    if (oldProfile !== this.currentProfile) {
      // Re-trigger configuration updates if profile changes
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("moq-profile-changed", { detail: this.currentProfile }));
      }
    }
  };

  private detectDeviceProfile() {
    if (typeof window === "undefined") {
      this.currentProfile = "desktop";
      return;
    }
    
    const width = window.innerWidth;
    if (width < 768) {
      this.currentProfile = "mobile";
    } else if (width < 1024) {
      this.currentProfile = "tablet";
    } else {
      this.currentProfile = "desktop";
    }
  }

  public getProfile(): "mobile" | "tablet" | "desktop" {
    return this.currentProfile;
  }

  public getConfig(): QualityProfile {
    return QualityProfiles[this.currentProfile];
  }

  // Fallback downgrade if FPS drop is detected
  public forceDowngrade() {
    if (this.currentProfile === "desktop") {
      this.currentProfile = "tablet";
    } else if (this.currentProfile === "tablet") {
      this.currentProfile = "mobile";
    }
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("moq-profile-changed", { detail: this.currentProfile }));
    }
  }
}

export const animationManager = new AnimationManager();
export { timelineRegistry };
