import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackToDashboard() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
    >
      <ArrowLeft size={16} />

      Back to Dashboard
    </button>
  );
}

export default BackToDashboard;