'use client'

import { useState } from 'react'
import { 
  toggleMetaGraphQLConfig, 
  deleteMetaGraphQLConfig,
  updateMetaGraphQLConfig,
  testMetaGraphQLConfig,
  getMetaGraphQLConfigs
} from '@/actions/meta-graphql-config-actions'
import { MetaGraphQLConfig } from '@prisma/client'

type MetaGraphQLConfigListProps = {
  initialConfigs: MetaGraphQLConfig[]
}

export default function MetaGraphQLConfigList({ 
  initialConfigs 
}: MetaGraphQLConfigListProps) {
  const [configs, setConfigs] = useState(initialConfigs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingJson, setEditingJson] = useState('')
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshConfigs = async () => {
    setIsRefreshing(true)
    const { success, data } = await getMetaGraphQLConfigs()
    if (success && data) {
      setConfigs(data)
    }
    setIsRefreshing(false)
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { success } = await toggleMetaGraphQLConfig(id, !currentStatus)
    if (success) {
      await refreshConfigs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return
    const { success } = await deleteMetaGraphQLConfig(id)
    if (success) {
      await refreshConfigs()
    }
  }

  const handleEdit = (config: MetaGraphQLConfig) => {
    setEditingId(config.id)
    setEditingJson(JSON.stringify(config.graphql_xhr, null, 2))
  }

  const handleSave = async (id: string) => {
    try {
      const graphql_xhr = JSON.parse(editingJson)
      const { success } = await updateMetaGraphQLConfig(id, graphql_xhr)
      if (success) {
        await refreshConfigs()
        setEditingId(null)
      }
    } catch (error) {
      alert('Invalid JSON format')
    }
  }

  const handleTest = async (id: string) => {
    const { success, data, error } = await testMetaGraphQLConfig(id)
    setTestResults({ 
      ...testResults, 
      [id]: { success, data: success ? data : error }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Configurations</h2>
        <button
          onClick={refreshConfigs}
          disabled={isRefreshing}
          className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
        >
          <svg
            className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      
      <div className="grid gap-6">
        {configs.map(config => (
          <div key={config.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleToggle(config.id, config.is_active)}
                  className={`
                    rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                    ${config.is_active 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {config.is_active ? '● Active' : '○ Inactive'}
                </button>
                <span className="text-sm text-gray-500">
                  Created: {new Date(config.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTest(config.id)}
                  className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                >
                  Test
                </button>
                <button
                  onClick={() => handleEdit(config)}
                  className="rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700 transition-colors hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(config.id)}
                  className="rounded-lg bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === config.id ? (
              <div className="mt-4 space-y-4">
                <textarea
                  value={editingJson}
                  onChange={(e) => setEditingJson(e.target.value)}
                  className="h-64 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSave(config.id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Configuration</h3>
                  <pre className="max-h-64 overflow-auto rounded-lg bg-gray-50 p-4 text-sm">
                    {JSON.stringify(config.graphql_xhr, null, 2)}
                  </pre>
                </div>
                {testResults[config.id] && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Test Response</h3>
                    <pre className={`max-h-64 overflow-auto rounded-lg p-4 text-sm ${
                      testResults[config.id].success ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {typeof testResults[config.id].data === 'string' 
                        ? testResults[config.id].data
                        : JSON.stringify(testResults[config.id].data, null, 2)
                      }
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}