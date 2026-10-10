'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Locate,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileText,
} from 'lucide-react';

function SubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialActivityId = searchParams.get('activityId') || SAMPLE_ACTIVITIES[0].id;

  const { profile } = useAuth();

  const [activityId, setActivityId] = useState(initialActivityId);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [claimedLat, setClaimedLat] = useState<string>('');
  const [claimedLng, setClaimedLng] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<{ id: string; status: string } | null>(null);

  const selectedActivity = SAMPLE_ACTIVITIES.find((a) => a.id === activityId) || SAMPLE_ACTIVITIES[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
        setErrorMsg('Only JPEG, PNG, or WebP images are permitted for evidence verification.');
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMsg('File size exceeds 10MB limit. Please upload a compressed image.');
        return;
      }
      setErrorMsg('');
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported in your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setClaimedLat(pos.coords.latitude.toFixed(6));
        setClaimedLng(pos.coords.longitude.toFixed(6));
      },
      (err) => {
        setIsLocating(false);
        alert(`Location permission denied: ${err.message}`);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !filePreview) {
      setErrorMsg('Please upload a photograph confirming your completion.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setUploadProgress(20);

    try {
      // Simulate progress
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 25 : prev));
      }, 200);

      const evidencePath = `evidence/${profile.id}/${Date.now()}_${file?.name || 'summit_photo.jpg'}`;

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          evidence_path: filePreview || evidencePath,
          claimed_latitude: claimedLat ? parseFloat(claimedLat) : selectedActivity.latitude,
          claimed_longitude: claimedLng ? parseFloat(claimedLng) : selectedActivity.longitude,
          user_id: profile.id,
          user_display_name: profile.display_name,
        }),
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const json = await res.json();
      setUploading(false);

      if (!res.ok) {
        setErrorMsg(json.message || 'Submission failed');
      } else {
        setSuccessResult({ id: json.submission_id, status: json.submission_status });
      }
    } catch (err: any) {
      setUploading(false);
      setErrorMsg(err.message || 'Network error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-[#101b15] border border-[#1e3427] p-8 rounded-3xl shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifiable Evidence Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Submit Proof of Adventure Completion
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Upload summit or expedition photo proof with coordinates. Once verified by an administrator, achievement points will be credited to your ledger.
          </p>
        </div>

        {successResult ? (
          <div className="p-6 rounded-2xl bg-[#12241a] border border-emerald-600/70 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Evidence Submitted Successfully!
              </h2>
              <p className="text-xs text-zinc-300 mt-1 max-w-md mx-auto">
                Submission reference: <span className="font-mono text-emerald-400">{successResult.id}</span>. Status is currently marked as <span className="font-bold uppercase text-amber-300">{successResult.status}</span> awaiting administrator review.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1b2b22] hover:bg-[#23382c] text-zinc-200 border border-[#2b4436] transition-colors"
              >
                View in Admin Review Panel
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Select Activity */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Select Completed Adventure Activity
              </label>
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {SAMPLE_ACTIVITIES.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.name} (+{act.base_points} pts • {act.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Activity Preview Card */}
            <div className="p-4 rounded-2xl bg-[#0b1410] border border-[#1a2d21] flex items-center gap-4">
              <img
                src={selectedActivity.image_url}
                alt={selectedActivity.name}
                className="w-16 h-16 rounded-xl object-cover ring-1 ring-emerald-600/40"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {selectedActivity.name}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {selectedActivity.location_name} • Difficulty: {selectedActivity.difficulty}/5
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  Available reward: +{selectedActivity.base_points} points
                </div>
              </div>
            </div>

            {/* Evidence File Upload Dropzone */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Photographic Proof of Completion (JPEG, PNG, WebP)
              </label>

              <div className="relative border-2 border-dashed border-[#1f382a] hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-[#09120d] transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {filePreview ? (
                  <div className="space-y-3">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-56 mx-auto rounded-xl object-cover shadow-lg"
                    />
                    <div className="text-xs text-emerald-400 font-semibold">
                      Photo ready for upload ({file?.name || 'photo.jpg'})
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Click or drag a new image to replace
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      Drag and drop evidence photo, or browse
                    </div>
                    <p className="text-xs text-zinc-500">
                      Private storage bucket upload • Maximum file size 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Claimed GPS Coordinates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  Claimed GPS Coordinates (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={isLocating}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={claimedLat}
                  onChange={(e) => setClaimedLat(e.target.value)}
                  placeholder={`Latitude (e.g. ${selectedActivity.latitude.toFixed(4)})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  step="any"
                  value={claimedLng}
                  onChange={(e) => setClaimedLng(e.target.value)}
                  placeholder={`Longitude (e.g. ${selectedActivity.longitude.toFixed(4)})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1410] border border-[#1d3326] text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-emerald-300 font-semibold">
                  <span>Encrypting & Registering Evidence...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#0b1410] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-950/60 transition-all disabled:opacity-50"
            >
              {uploading ? 'Verifying Upload...' : 'Submit Evidence for Verification'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function NewSubmissionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-zinc-400">Loading submission form...</div>}>
      <SubmissionForm />
    </Suspense>
  );
}
