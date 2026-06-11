import { useState, FormEvent } from "react";
import PropTypes from "prop-types";
import { transformProject } from "../../api";
import { useProjectContext } from "../../context/ProjectContext";
import { useToast } from "../../context/ToastContext";
import useError from "../../hooks/useError";
import FormErrorAlert from "../common/FormErrorAlert";

const STRATEGIES = [
  { value: "custom", label: "Custom Value" },
  { value: "mean", label: "Mean" },
  { value: "median", label: "Median" },
  { value: "mode", label: "Mode" },
  { value: "ffill", label: "Forward Fill" },
  { value: "bfill", label: "Backward Fill" },
];

const FillEmptyForm = ({ projectId, onClose }: {projectId: string, onClose: () => void}) => {
  const { columns } = useProjectContext();
  const { showToast } = useToast();
  const { error, clearError, handleError } = useError();

  const [selectedColumn, setSelectedColumn] = useState("");
  const [strategy, setStrategy] = useState("custom");
  const [fillValue, setFillValue] = useState("");
  const { refreshProject, pageSize } = useProjectContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const columnIndex = selectedColumn !== "" ? columns.indexOf(selectedColumn) : null;

    try {
      await transformProject(projectId, {
        operation_type: "fillEmpty",
        fill_empty_params: {
          index: columnIndex,
          strategy,
          fill_value: strategy === "custom" ? fillValue : null,
        },
      });

      await refreshProject(projectId, 1, pageSize);
      onClose();
    } catch (err) {
      showToast((err as any).response?.data?.detail || "Failed to fill empty cells.", "error");
      handleError(err);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <form onSubmit={handleSubmit}>
        <h3 className="font-semibold text-gray-900 mb-4">Fill Empty Cells</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Column:</label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border border-gray-300 rounded-md w-full px-3 py-2 bg-white text-gray-900"
          >
            <option value="">All columns</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Note: Mean, median, and mode require a specific column.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Strategy:</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="border border-gray-300 rounded-md w-full px-3 py-2 bg-white text-gray-900"
          >
            {STRATEGIES.map((strategyOption) => (
              <option key={strategyOption.value} value={strategyOption.value}>
                {strategyOption.label}
              </option>
            ))}
          </select>
        </div>

        {strategy === "custom" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fill Value:</label>
            <input
              type="text"
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              placeholder="Enter value"
              className="border border-gray-300 rounded-md w-full px-3 py-2 bg-white text-gray-900"
              required
            />
          </div>
        )}

        <FormErrorAlert message={error} />

        <div className="flex justify-between mt-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

FillEmptyForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FillEmptyForm;
