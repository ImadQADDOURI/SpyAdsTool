'use client'

import { useState } from 'react'
import { createMetaGraphQLConfig } from '@/actions/meta-graphql-config-actions'

export default function MetaGraphQLConfigForm() {
  const [jsonInput, setJsonInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    try {
      const graphql_xhr = JSON.parse(jsonInput)
      const result = await createMetaGraphQLConfig(graphql_xhr)
      
      if (result.success) {
        setJsonInput('')
        setMessage({ type: 'success', text: 'Configuration added successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add configuration' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON format' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Add New Configuration</h2>
        {message && (
          <div className={`rounded px-4 py-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>
      <div className="mb-4">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="h-64 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="{
  &quot;url&quot;: &quot;https://...&quot;,
  &quot;headers&quot;: {
    &quot;accept&quot;: &quot;*/*&quot;,
    ...
  },
  &quot;body&quot;: &quot;...&quot;,
  &quot;method&quot;: &quot;POST&quot;
}"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            flex items-center space-x-2 rounded-lg px-6 py-2.5 font-medium text-white transition-colors duration-200
            ${isLoading ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            'Add Configuration'
          )}
        </button>
      </div>
    </form>
  )
}