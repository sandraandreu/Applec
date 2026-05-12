import { useReducer } from "react";
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
import { createEventReducer, initialState } from "./create-event.reducer";

const CreateEventPage = () => {
  const [state, dispatch] = useReducer(createEventReducer, initialState);
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();

  const handleStep1Complete = (data: CreateEventStep1Data) => {
    dispatch({ type: "COMPLETE_STEP1", payload: data });
  };

  const handleStep2Complete = (data: CreateEventStep2Data) => {
    dispatch({ type: "COMPLETE_STEP2", payload: data });
  };

  const handleStep2Back = (draft: CreateEventStep2Draft) => {
    dispatch({ type: "BACK_TO_STEP1", payload: draft });
  };

  const handleStep3Back = (draft: CreateEventStep3Draft) => {
    dispatch({ type: "BACK_TO_STEP2", payload: draft });
  };

  const handleStep3Complete = async (data: CreateEventStep3Data) => {
    if (!profile?.groupId || !user || !state.step1Data || !state.step2Data) return;
    dispatch({ type: "SET_SUBMITTING" });
    try {
      await createEvent(profile.groupId, {
        groupId: profile.groupId,
        createdBy: user.uid,
        name: state.step1Data.eventName,
        date: state.step2Data.date,
        location: state.step2Data.location,
        startTime: state.step2Data.startTime,
        requiresConfirmation: data.requiresConfirmation,
        sendReminder: data.sendReminder,
        isSpecial: state.step1Data.eventType === "special",
        ...(state.step1Data.description && { description: state.step1Data.description }),
        ...(state.step2Data.endTime && { endTime: state.step2Data.endTime }),
        ...(data.confirmationDeadline && { confirmationDeadline: data.confirmationDeadline }),
      });
      navigate("/events");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: getErrorKey(error) });
    }
  };

  if (state.step === 1) {
    return (
      <CreateEventStep1Page
        onComplete={handleStep1Complete}
        initialData={state.step1Data}
      />
    );
  }

  if (state.step === 2 && state.step1Data) {
    return (
      <CreateEventStep2Page
        onComplete={handleStep2Complete}
        onBack={handleStep2Back}
        initialData={state.step2Draft}
        eventType={state.step1Data.eventType}
      />
    );
  }

  if (state.step === 3 && state.step1Data && state.step2Data) {
    return (
      <CreateEventStep3Page
        step1Data={state.step1Data}
        step2Data={state.step2Data}
        onComplete={handleStep3Complete}
        onBack={handleStep3Back}
        initialData={state.step3Draft}
        isLoading={state.isLoading}
        errorKey={state.errorKey}
      />
    );
  }

  return null;
};

export default CreateEventPage;
