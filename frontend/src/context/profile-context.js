import { createContext, useContext, useState } from "react";
import { OWNER_NAME } from "../lib/content";

export const emptyProfile = {
  intro: { audio: null, transcript: "", updated: null },
  autopsy: {
    projectName: "",
    role: "",
    mistakes: { happened: "", cost: "", change: "" },
    decisions: Array.from({ length: 6 }, () => ({
      title: "",
      context: "",
      decision: "",
      reason: "",
      result: "",
      evidence: "",
      evidenceOk: false,
      lesson: "",
    })),
  },
  bharat: { origin: "", users: "", languages: "", learned: "" },
  secret: { story: "", message: "" },
  receipts: Array.from({ length: 3 }, () => ({ title: "", said: "", transcribed: "", built: "", evidence: "" })),
  projects: Array.from({ length: 4 }, () => ({ title: "", summary: "", work: "", tools: "", link: "", evidenceOk: false })),
  skills: Array.from({ length: 4 }, () => ({ name: "", items: "" })),
  about: { role: "", bio: "", resume: "", linkedin: "", github: "", other: "" },
  contact: { email: "", location: "", profiles: "", publish: false },
};

export const PROFILE_KEY = "outloud-profile-v1";

const ProfileContext = createContext({ profile: emptyProfile, applyProfile: () => {}, clearProfile: () => {} });

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return { ...emptyProfile, ...JSON.parse(raw) };
    } catch (e) {}
    return emptyProfile;
  });

  const applyProfile = (p) => {
    setProfile(p);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch (e) {}
  };

  const clearProfile = () => {
    setProfile(emptyProfile);
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (e) {}
  };

  return (
    <ProfileContext.Provider value={{ profile, applyProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export { OWNER_NAME };
