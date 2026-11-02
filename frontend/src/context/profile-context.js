import { createContext, useContext, useState } from "react";
import { BASE_PROFILE, OWNER_NAME } from "../lib/profile-data";

export const emptyProfile = BASE_PROFILE;
export const PROFILE_KEY = "outloud-profile-v1";
const ProfileContext = createContext(null);
export const ProfileProvider = ({ children }) => {
  // Public content never hydrates from private drafts or the old applied localStorage key.
  const [profile, setProfile] = useState(BASE_PROFILE);
  const applyProfile = (draft) => {
    const { voiceNotes, ...text } = draft;
    // Transcripts and audio are kept in the private draft even during local text preview.
    setProfile({ ...text, intro: BASE_PROFILE.intro,
      receipts: text.receipts.map((r) => ({ ...r, said: "", transcribed: "" })) });
  };
  return <ProfileContext.Provider value={{ profile, applyProfile, clearProfile: () => setProfile(BASE_PROFILE) }}>{children}</ProfileContext.Provider>;
};
export const useProfile = () => useContext(ProfileContext);
export { OWNER_NAME };