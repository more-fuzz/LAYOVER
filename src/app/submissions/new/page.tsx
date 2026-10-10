'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { StatusTag } from '@/components/ui/StatusTag';
import { ActivityItem } from '@/data/sampleData';

function SubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialActivityId = searchParams.get('activityId') || '';

  const { user, profile, isDemoUser } = useAuth();
  const isAuthenticated = !!user || !isDemoUser;

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Choose activity, 1: Add evidence, 2: Review and send, 3: Status

  const [selectedActivityId, setSelectedActivityId] = useState<string>(initialActivityId);
  const [evidencePath, setEvidencePath] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [claimedLat, setClaimedLat] = useState<string>('');
  const [claimedLng, setClaimedLng] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ id: string; status: string } | null>(null);

  // Load activities list for dropdown
  useEffect(() => {
    apiClient.get<ActivityItem[]>('/api/activities').then((res) => {
      if (res.ok && Array.isArray(res.data)) {
        setActivities(res.data);
        if (!selectedActivityId && res.data.length > 0) {
          setSelectedActivityId(res.data[0].id);
        }
      }
    });
  }, [selectedActivityId]);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  // Stepper labels
  const steps = [
    { title: 'Choose activity' },
    { title: 'Add evidence' },
    { title: 'Review and send' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvidencePath(`evidence/${profile?.id || 'explorer'}/${Date.now()}_${file.name}`);
      setFilePreview(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setClaimedLat(pos.coords.latitude.toFixed(6));
        setClaimedLng(pos.coords.longitude.toFixed(6));
        setErrorMessage(null);
      },
      (err) => {
        setIsLocating(false);
        setErrorMessage(`Location access unavailable: ${err.message}`);
      }
    );
  };

  // Submit handler: strictly no optimistic success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) {
      setErrorMessage('Please select an adventure activity.');
      return;
    }
    if (!evidencePath && !filePreview) {
      setErrorMessage('Please attach an evidence photograph.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const lat = claimedLat ? parseFloat(claimedLat) : null;
    const lng = claimedLng ? parseFloat(claimedLng) : null;

    const payload = {
      activity_id: selectedActivityId,
      evidence_path: evidencePath || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
      claimed_latitude: lat,
      claimed_longitude: lng,
    };

    const res = await apiClient.post<{ id: string; status: string }>('/api/submissions', payload);

    setIsSubmitting(false);

    if (res.ok && res.data) {
      setSubmissionResult(res.data);
      setCurrentStep(3); // Show status screen
    } else {
      setErrorMessage(res.message || 'Failed to submit evidence. Please try again.');
    }
  };

  return (
    <div className="field-container max-w-2xl w-full py-8 md:py-12 space-y-8 page-rise">
      {/* Back button */}
      <div>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] transition-colors"
        >
          <Icon name="arrow-left" size={14} aria-hidden="true" />
          <span>Back to Adventure Map</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
          VERIFICATION PROTOCOL
        </span>
        <h1 className="font-display text-2xl md:text-4xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
          Record completion.
        </h1>
        <p className="text-xs text-[var(--muted,#5E675F)] mt-1 leading-relaxed">
          Submit authentic photographic evidence and approximate waypoint coordinates for review.
        </p>
      </div>

      {/* Stepper (Only in form mode) */}
      {currentStep < 3 && (
        <ProgressSteps steps={steps} currentStep={currentStep} className="pt-2 pb-4" />
      )}

      {/* Error alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-[var(--radius,14px)] border border-[var(--folklore,#B8390A)]/40 bg-[#FBF3F0] text-xs text-[var(--folklore,#B8390A)] flex items-center gap-2"
        >
          <Icon name="compass" size={16} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 0: Choose activity */}
      {currentStep === 0 && (
        <div className="card-field p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="activity-select" className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] block">
              1. Select Adventure Activity
            </label>
            <select
              id="activity-select"
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full h-11 px-3 bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] rounded-[var(--radius,14px)] text-sm font-medium text-[var(--ink,#0F1F1A)] focus:border-[var(--flame,#FF5A1F)] transition-colors"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.name} ({act.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {selectedActivity && (
            <div className="p-4 rounded-[var(--radius-sm,8px)] bg-[var(--sand,#EADFC8)]/50 border border-[var(--line,#D8CBB0)] text-xs space-y-1">
              <div className="font-bold text-[var(--ink,#0F1F1A)]">{selectedActivity.name}</div>
              <div className="text-[var(--muted,#5E675F)] line-clamp-2">{selectedActivity.description}</div>
              <div className="font-mono-label text-[10px] text-[var(--flame,#FF5A1F)] pt-1 font-bold">
                Award: +{selectedActivity.base_points} PTS upon arbiter verification
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="ink"
              onClick={() => {
                if (!selectedActivityId) setErrorMessage('Please choose an activity.');
                else setCurrentStep(1);
              }}
              hasArrow
            >
              Next: Add evidence
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1: Add evidence */}
      {currentStep === 1 && (
        <div className="card-field p-6 space-y-6">
          <div className="space-y-2">
            <label className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)] block">
              2. Upload Photographic Evidence
            </label>
            <p className="text-xs text-[var(--muted,#5E675F)]">
              Photographs are evidence, not proof. Geotagged images assist arbiters in validating presence at the coordinates.
            </p>

            <div className="mt-2 border-2 border-dashed border-[var(--line,#D8CBB0)] rounded-[var(--radius,14px)] p-6 text-center hover:border-[var(--flame,#FF5A1F)] transition-colors bg-[var(--sand,#EADFC8)]/30">
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label htmlFor="photo-upload" className="cursor-pointer block space-y-2">
                <div className="w-10 h-10 rounded-full bg-[var(--sand,#EADFC8)] text-[var(--ink,#0F1F1A)] flex items-center justify-center mx-auto">
                  <Icon name="compass" size={20} aria-hidden="true" />
                </div>
                <div className="text-xs font-semibold text-[var(--flame,#FF5A1F)] underline">
                  Choose photo from device
                </div>
                <div className="text-[10px] text-[var(--muted,#5E675F)] font-mono-label">
                  JPEG, PNG, WebP up to 10MB
                </div>
              </label>
            </div>

            {filePreview && (
              <div className="mt-4 p-2 rounded-[var(--radius-sm,8px)] border border-[var(--line,#D8CBB0)] bg-[var(--card,#FFFAF0)] flex items-center gap-3">
                <img src={filePreview} alt="Preview" className="w-16 h-16 rounded object-cover" />
                <div className="text-xs text-[var(--ink,#0F1F1A)] font-mono-label">
                  Evidence photo attached &check;
                </div>
              </div>
            )}
          </div>

          {/* Optional GPS coordinates */}
          <div className="space-y-3 pt-3 border-t border-[var(--line,#D8CBB0)]">
            <div className="flex items-center justify-between">
              <label className="font-display font-bold text-xs text-[var(--ink,#0F1F1A)]">
                Coordinates (Optional)
              </label>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLocating}
                className="text-xs font-mono-label text-[var(--flame,#FF5A1F)] hover:underline flex items-center gap-1"
              >
                <Icon name="pin" size={12} aria-hidden="true" />
                <span>{isLocating ? 'Calibrating...' : 'Use current location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Latitude (e.g. 30.3165)"
                value={claimedLat}
                onChange={(e) => setClaimedLat(e.target.value)}
                className="h-10 px-3 bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] rounded text-xs font-mono-label"
              />
              <input
                type="text"
                placeholder="Longitude (e.g. 78.0322)"
                value={claimedLng}
                onChange={(e) => setClaimedLng(e.target.value)}
                className="h-10 px-3 bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] rounded text-xs font-mono-label"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line,#D8CBB0)]">
            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              Back
            </Button>
            <Button
              variant="ink"
              onClick={() => {
                if (!evidencePath && !filePreview) {
                  setErrorMessage('Please attach an evidence photograph.');
                } else {
                  setCurrentStep(2);
                }
              }}
              hasArrow
            >
              Next: Review &amp; send
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Review and send */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="card-field p-6 space-y-6">
          <h2 className="font-display font-bold text-base text-[var(--ink,#0F1F1A)] border-b border-[var(--line,#D8CBB0)] pb-3">
            3. Review &amp; Send for Arbiter Verification
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--line,#D8CBB0)]/40">
              <span className="text-[var(--muted,#5E675F)] font-mono-label">Activity:</span>
              <span className="font-bold text-[var(--ink,#0F1F1A)]">{selectedActivity?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--line,#D8CBB0)]/40">
              <span className="text-[var(--muted,#5E675F)] font-mono-label">Category:</span>
              <span className="capitalize font-mono-label text-[var(--ink,#0F1F1A)]">{selectedActivity?.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--line,#D8CBB0)]/40">
              <span className="text-[var(--muted,#5E675F)] font-mono-label">Coordinates:</span>
              <span className="font-mono-label text-[var(--ink,#0F1F1A)]">
                {claimedLat && claimedLng ? `${claimedLat}, ${claimedLng}` : 'None provided'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--line,#D8CBB0)]/40">
              <span className="text-[var(--muted,#5E675F)] font-mono-label">Evidence:</span>
              <span className="text-[var(--jade-deep,#0B7A50)] font-bold">Attached for private inspection</span>
            </div>
          </div>

          <div className="p-3 rounded-[var(--radius-sm,8px)] bg-[var(--sand,#EADFC8)]/40 text-[11px] text-[var(--muted,#5E675F)] leading-relaxed">
            By sending this report, you certify that you completed this adventure safely and followed Leave-No-Trace principles. Submissions are reviewed by human arbiters prior to points ledger insertion.
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line,#D8CBB0)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="flame"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send for review'}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Status confirmation screen */}
      {currentStep === 3 && submissionResult && (
        <div className="card-field p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[var(--sand,#EADFC8)] text-[var(--ink,#0F1F1A)] flex items-center justify-center mx-auto">
            <Icon name="check" size={28} className="text-[var(--jade-deep,#0B7A50)]" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <div className="inline-block">
              <StatusTag status="pending" label="Sent for review" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--ink,#0F1F1A)]">
              Sent for review.
            </h2>
            <p className="text-xs text-[var(--muted,#5E675F)] max-w-md mx-auto leading-relaxed">
              Your field evidence has been received and queued for review. Status and points ledger entry will appear in your memoir once confirmed.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" href="/memoir">
              View Journal
            </Button>
            <Button variant="ink" href="/explorer" hasArrow>
              Explore adventures
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewSubmissionPage() {
  return (
    <Suspense
      fallback={
        <div className="field-container w-full py-12 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Loading submission workflow...
        </div>
      }
    >
      <SubmissionForm />
    </Suspense>
  );
}
