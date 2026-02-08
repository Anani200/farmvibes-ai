import { useForm } from 'react-hook-form';
import type { Workflow } from '@/types/api';

interface WorkflowParamsFormProps {
  workflow: Workflow;
  onSubmit: (params: Record<string, unknown>) => void;
  loading?: boolean;
}

export function WorkflowParamsForm({ workflow, onSubmit, loading = false }: WorkflowParamsFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Record<string, unknown>>();

  if (!workflow.inputs || workflow.inputs.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">This workflow has no custom parameters.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {workflow.inputs.map((input) => {
        const isRequired = input.required ?? false;
        const fieldName = input.name;

        return (
          <div key={fieldName}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {input.name}
              {isRequired && <span className="text-red-600 ml-1">*</span>}
            </label>

            {input.description && (
              <p className="text-sm text-gray-600 mb-2">{input.description}</p>
            )}

            <div>
              {input.type === 'string' && (
                <input
                  type="text"
                  {...register(fieldName, { required: isRequired })}
                  placeholder={`Enter ${input.name}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}

              {input.type === 'integer' && (
                <input
                  type="number"
                  step="1"
                  {...register(fieldName, { required: isRequired })}
                  placeholder={`Enter ${input.name}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}

              {input.type === 'number' && (
                <input
                  type="number"
                  step="any"
                  {...register(fieldName, { required: isRequired })}
                  placeholder={`Enter ${input.name}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}

              {input.type === 'boolean' && (
                <input
                  type="checkbox"
                  {...register(fieldName)}
                  className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                />
              )}

              {(input.type === 'object' || input.type === 'array') && (
                <textarea
                  {...register(fieldName, { required: isRequired })}
                  placeholder={`Enter JSON ${input.type}`}
                  className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}

              {!['string', 'integer', 'number', 'boolean', 'object', 'array'].includes(input.type) && (
                <input
                  type="text"
                  {...register(fieldName, { required: isRequired })}
                  placeholder={`Enter ${input.name} (${input.type})`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
            </div>

            {errors[fieldName] && (
              <p className="text-red-600 text-sm mt-1">
                {input.name} is required
              </p>
            )}

            {input.default !== undefined && (
              <p className="text-gray-600 text-xs mt-1">
                Default: {JSON.stringify(input.default)}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Workflow'}
      </button>
    </form>
  );
}
