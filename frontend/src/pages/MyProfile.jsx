import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Link2,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Target,
  Building2,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";

const ProfileView = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    github: "",
    role: "",
    college: "",
    degree: "",
    graduationYear: "",
    areasOfInterest: [],
    skills: [],
    targetCompanies: [],
    preferredInterviewTypes: [],
    groq_api_key: "",
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newCompany, setNewCompany] = useState("");

  const interviewTypes = [
    "Technical",
    "Behavioral",
    "System Design",
    "Coding",
    "HR Round",
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/user/profile", {
        headers: {
          "X-User-Id": user.id,
          "X-User-Email": user.emailAddresses[0]?.emailAddress,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const profile = {
          name: data.name || "",
          phone: data.phone || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          role: data.role || "",
          college: data.college || "",
          degree: data.degree || "",
          graduationYear: data.graduationYear || "",
          areasOfInterest: data.areasOfInterest || [],
          skills: data.skills || [],
          targetCompanies: data.targetCompanies || [],
          preferredInterviewTypes: data.preferredInterviewTypes || [],
          groq_api_key: data.groq_api_key || "",
        };
        setProfileData(profile);
        setEditData(profile);
      } else {
        console.error("Failed to fetch profile:", response.status);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData({ ...profileData });
    setNewInterest("");
    setNewSkill("");
    setNewCompany("");
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({ ...profileData });
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.id,
          "X-User-Email": user.emailAddresses[0]?.emailAddress,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setProfileData(editData);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setEditData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const removeItem = (field, index) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleInterviewType = (type) => {
    setEditData((prev) => ({
      ...prev,
      preferredInterviewTypes: prev.preferredInterviewTypes.includes(type)
        ? prev.preferredInterviewTypes.filter((t) => t !== type)
        : [...prev.preferredInterviewTypes, type],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex gap-3">
            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              Profile updated successfully!
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                  {profileData.name
                    ? profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profileData.name || "User Name"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {profileData.role || "No role specified"}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {profileData.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {profileData.phone}
                    </span>
                  </div>
                )}
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {profileData.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <Code className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>
              </div>

              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={editData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={editData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      LinkedIn
                    </p>
                    {profileData.linkedin ? (
                      <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        Not provided
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      GitHub
                    </p>
                    {profileData.github ? (
                      <a
                        href={profileData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Education
                </h3>
              </div>

              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      College/University *
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={editData.college}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={editData.degree}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Graduation Year *
                    </label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={editData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      College/University
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.college || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Degree
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.degree || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Graduation Year
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.graduationYear || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Career Aspirations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Career Aspirations
                </h3>
              </div>

              <div className="space-y-5">
                {editing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={editData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Target Role
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.role || "Not provided"}
                    </p>
                  </div>
                )}

                {/* Areas of Interest */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Areas of Interest
                  </p>
                  {editing ? (
                    <>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(),
                            addItem(
                              "areasOfInterest",
                              newInterest,
                              setNewInterest
                            ))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Add area of interest"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addItem(
                              "areasOfInterest",
                              newInterest,
                              setNewInterest
                            )
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editData.areasOfInterest.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem("areasOfInterest", index)
                              }
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.areasOfInterest.length > 0 ? (
                        profileData.areasOfInterest.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No areas specified
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Technical Skills
                  </p>
                  {editing ? (
                    <>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(),
                            addItem("skills", newSkill, setNewSkill))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Add skill"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addItem("skills", newSkill, setNewSkill)
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeItem("skills", index)}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.length > 0 ? (
                        profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No skills specified
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Companies */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Target Companies
                  </p>
                  {editing ? (
                    <>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(),
                            addItem(
                              "targetCompanies",
                              newCompany,
                              setNewCompany
                            ))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Add company"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            addItem(
                              "targetCompanies",
                              newCompany,
                              setNewCompany
                            )
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editData.targetCompanies.map((company, index) => (
                          <span
                            key={index}
                            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                          >
                            {company}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem("targetCompanies", index)
                              }
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.targetCompanies.length > 0 ? (
                        profileData.targetCompanies.map((company, index) => (
                          <span
                            key={index}
                            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1.5 rounded-full text-sm"
                          >
                            {company}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No companies specified
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interview Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Interview Preferences
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                    Preferred Interview Types
                  </p>
                  {editing ? (
                    <div className="flex flex-wrap gap-3">
                      {interviewTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleInterviewType(type)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            editData.preferredInterviewTypes.includes(type)
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.preferredInterviewTypes.length > 0 ? (
                        profileData.preferredInterviewTypes.map(
                          (type, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-full text-sm"
                            >
                              {type}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No preferences specified
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GROQ API Key (Optional)
                    </label>
                    <input
                      type="password"
                      name="groq_api_key"
                      value={editData.groq_api_key}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your GROQ API key"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your API key from groq.com for enhanced features
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
