'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';
import SafeImage from '@/components/SafeImage';
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
  Lock,
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
  const [notes, setNotes] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<{ id: string; status: string } | null>(null);

  const selectedActivity =
    SAMPLE_ACTIVITIES.find((a) => a.id === activityId) || SAMPLE_ACTIVITIES[0];

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
    setUploadProgress(30);

    try {
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
          notes,
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

  if (successResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EAE1D3] border border-[#777A53] flex items-center justify-center text-[#777A53] mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#292820] font-sans">
            Field Evidence Dispatched!
          </h2>
          <p className="text-xs text-[#6D685C] leading-relaxed">
            Your verification dossier has been placed in encrypted private storage. A certified
            reviewer will inspect the GPS coordinates and photo authenticity before awarding points.
          </p>

          <div className="p-3 bg-[#F5F0E7] rounded-xl border border-[#D6CCBC] text-xs font-mono text-[#777A53] space-y-1">
            <div>REF ID: {successResult.id}</div>
            <div>STATUS: {successResult.status.toUpperCase()}</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/dashboard" className="btn-journal-primary text-xs py-2 px-4">
              Return to Dashboard
            </Link>
            <Link href="/arena" className="btn-journal-secondary text-xs py-2 px-4">
              View Arena Points
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D685C] hover:text-[#292820] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] p-6 sm:p-10 rounded-2xl shadow-xs space-y-6">
        <div className="border-b border-[#D6CCBC] pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-2.5 py-0.5 rounded border border-[#D6CCBC] mb-2">
            <Lock className="w-3 h-3 text-[#B85F43]" />
            <span>ENCRYPTED PRIVATE STORAGE DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
            Submit Field Completion Evidence
          </h1>
          <p className="text-xs text-[#6D685C] mt-1 leading-relaxed">
            Upload summit photography or trail waypoint evidence. Points are awarded solely through
            server-side reviewer approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Activity Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6D685C] block">
              1. Completed Expedition Discipline:
            </label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] font-sans focus:outline-hidden"
            >
              {SAMPLE_ACTIVITIES.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.name} ({act.location_name}) — +{act.base_points} pts
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6D685C] block">
              2. Upload Summit / Waypoint Proof:
            </label>
            <div className="border-2 border-dashed border-[#D6CCBC] bg-[#F5F0E7] rounded-xl p-6 text-center space-y-3">
              {filePreview ? (
                <div className="max-w-xs mx-auto rounded-lg overflow-hidden border border-[#D6CCBC]">
                  <SafeImage
                    src={filePreview}
                    alt="Preview"
                    aspectRatio="16/9"
                    fallbackTitle="Selected Evidence"
                  />
                </div>
              ) : (
                <UploadCloud className="w-10 h-10 text-[#777A53] mx-auto opacity-60" />
              )}

              <div>
                <input
                  type="file"
                  id="evidence-file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="evidence-file"
                  className="btn-journal-secondary text-xs inline-block cursor-pointer py-2 px-4"
                >
                  {file ? 'Change Photo File' : 'Select Photo from Device'}
                </label>
              </div>

              <p className="text-[10px] text-[#8E8675] font-mono">
                JPEG, PNG, WebP up to 10MB. Stored in private bucket accessible only to reviewers.
              </p>
            </div>
          </div>

          {/* GPS Location Coordinates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6D685C]">
                3. Trailhead Coordinates (Optional / Geotag):
              </label>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLocating}
                className="text-[11px] font-mono font-bold text-[#777A53] hover:underline flex items-center gap-1"
              >
                <Locate className="w-3 h-3" />
                <span>{isLocating ? 'Calibrating...' : 'Use Current Device GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={`Lat (e.g. ${selectedActivity.latitude})`}
                value={claimedLat}
                onChange={(e) => setClaimedLat(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] font-mono"
              />
              <input
                type="text"
                placeholder={`Lng (e.g. ${selectedActivity.longitude})`}
                value={claimedLng}
                onChange={(e) => setClaimedLng(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] font-mono"
              />
            </div>
          </div>

          {/* Expedition Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6D685C] block">
              4. Field Journal Log / Route Details:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reached Roopkund glacial ridge at 14:00. Cleared trail markers and confirmed Leave-No-Trace etiquette..."
              className="w-full text-xs p-3 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] focus:outline-hidden"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FFFDF8] border border-[#B85F43] text-[#B85F43] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="btn-journal-terracotta w-full py-3 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? `Encrypting & Uploading (${uploadProgress}%)...` : 'Submit Dossier for Review'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewSubmissionPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-[#6D685C]">
          Loading field submission form...
        </div>
      }
    >
      <SubmissionForm />
    </Suspense>
  );
}
