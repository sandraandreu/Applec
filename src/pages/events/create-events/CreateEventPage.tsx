import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateEventStep1Page from "./CreateEventStep1Page";
import CreateEventStep2Page from "./CreateEventStep2Page";
import CreateEventStep3Page from "./CreateEventStep3Page";
import type { CreateEventStep1Data } from "./CreateEventStep1Page";
import type { CreateEventStep2Data, CreateEventStep2Draft } from "./CreateEventStep2Page";
import type { CreateEventStep3Data, CreateEventStep3Draft } from "./CreateEventStep3Page";
import { createEvent } from "../../../services/event.service";
import { useAuthContext } from "../../../context/auth/AuthContext";
import { getErrorKey } from "../../../utils/firebase-errors";

const CreateEventPage = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<CreateEventStep1Data | undefined>();
  const [step2Data, setStep2Data] = useState<CreateEventStep2Data | undefined>();
  const [step2Draft, setStep2Draft] = useState<CreateEventStep2Draft | undefined>();
  const [step3Draft, setStep3Draft] = useState<CreateEventStep3Draft | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | undefined>();
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();

  const handleStep1Complete = (data: CreateEventStep1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2Complete = (data: CreateEventStep2Data) => {
    setStep2Data(data);
    setStep2Draft({ ...data, endTime: data.endTime ?? "" });
    setStep(3);
  };

  const handleStep2Back = (draft: CreateEventStep2Draft) => {
    setStep2Draft(draft);
    setStep(1);
  };

  const handleStep3Back = (draft: CreateEventStep3Draft) => {
    setStep3Draft(draft);
    setStep(2);
  };

  const handleStep3Complete = async (data: CreateEventStep3Data) => {
    if (!profile?.groupId || !user || !step1Data || !step2Data) return;
    setIsLoading(true);
    setErrorKey(undefined);
    try {
      await createEvent(profile.groupId, {
        groupId: profile.groupId,
        createdBy: user.uid,
        name: step1Data.eventName,
        date: step2Data.date,
        location: step2Data.location,
        startTime: step2Data.startTime,
        requiresConfirmation: data.requiresConfirmation,
        sendReminder: data.sendReminder,
        isSpecial: step1Data.eventType === "special",
        ...(step1Data.description && { description: step1Data.description }),
        ...(step2Data.endTime && { endTime: step2Data.endTime }),
        ...(data.confirmationDeadline && { confirmationDeadline: data.confirmationDeadline }),
      });
      navigate("/events");
    } catch (error) {
      console.error("Create event error:", error);
      setErrorKey(getErrorKey(error));
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return <CreateEventStep1Page onComplete={handleStep1Complete} initialData={step1Data} />;
  }

  if (step === 2 && step1Data) {
    return (
      <CreateEventStep2Page
        onComplete={handleStep2Complete}
        onBack={handleStep2Back}
        initialData={step2Draft}
        eventType={step1Data.eventType}
      />
    );
  }

  if (step === 3 && step1Data && step2Data) {
    return (
      <CreateEventStep3Page
        step1Data={step1Data}
        step2Data={step2Data}
        onComplete={handleStep3Complete}
        onBack={handleStep3Back}
        initialData={step3Draft}
        isLoading={isLoading}
        errorKey={errorKey}
      />
    );
  }

  return null;
};

export default CreateEventPage;
