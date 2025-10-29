"use client";

import { useState } from "react";
import { testMetaRequest } from "@/actions/metaRequests";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useTheme } from "next-themes";
import JsonView from "react-json-view";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface TestPanelProps {
  request: any;
}

export function TestPanel({ request }: TestPanelProps) {
  const { theme } = useTheme();
  const [variables, setVariables] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [variablesError, setVariablesError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleTest = async (includeRaw = true) => {
    setVariablesError(null);
    setError(null);

    let parsedVars: Record<string, any> = {};
    try {
      parsedVars = JSON.parse(variables);
    } catch {
      setVariablesError("Invalid JSON in variables");
      return;
    }

    setLoading(true);
    try {
      const res = await testMetaRequest(
        request.id,
        Object.keys(parsedVars).length > 0 ? parsedVars : undefined,
        includeRaw,
      );

      if (res.success) {
        setResult(res.result);
      } else {
        setError(res.error || "Test failed");
      }
    } catch (err: any) {
      setError(err.message || "Test failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Extract body variables from base_request
  const baseRequestBody = request.base_request?.body || "";
  let bodyVariables: Record<string, string> = {};
  try {
    if (baseRequestBody) {
      const params = new URLSearchParams(baseRequestBody);
      const vars = params.get("variables");
      if (vars) {
        bodyVariables = JSON.parse(decodeURIComponent(vars));
      }
    }
  } catch (e) {
    console.error("Failed to parse body variables:", e);
  }

  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      {/* Request Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{request.friendly_name || request.name}</CardTitle>
              <CardDescription className="mt-1">{request.name}</CardDescription>
            </div>
            <Badge variant={request.is_active ? "default" : "secondary"}>
              {request.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Base Request Body Variables */}
        {Object.keys(bodyVariables).length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">
                  Base Request Variables
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1"
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(bodyVariables, null, 2),
                    "base-request",
                  )
                }
              >
                {copiedField === "base-request" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg border border-muted bg-muted p-3">
                <JsonView
                  src={bodyVariables}
                  theme={isDark ? "monokai" : "rjv-default"}
                  collapsed={false}
                  collapseStringsAfterLength={100}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  name={false}
                  enableClipboard={true}
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Configuration</CardTitle>
            <CardDescription>Override variables or test as-is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="variables">Variables (JSON)</Label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2"
                    onClick={() => copyToClipboard(variables, "test-config")}
                    title="Copy variables"
                  >
                    {copiedField === "test-config" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2"
                    onClick={() => {
                      setVariables("{}");
                      setVariablesError(null);
                    }}
                    title="Reset variables"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                id="variables"
                value={variables}
                onChange={(e) => {
                  setVariables(e.target.value);
                  setVariablesError(null);
                }}
                placeholder='{"variable_name": "value"}'
                className={`h-48 font-mono text-xs ${variablesError ? "border-destructive" : ""}`}
              />
              {variablesError && (
                <p className="text-xs text-destructive">{variablesError}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleTest(true)}
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Test with Variables
              </Button>
              <Button
                onClick={() => handleTest(true)}
                disabled={loading}
                variant="outline"
                className="flex-1 gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Test As-Is
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="extracted">Extracted Fields</TabsTrigger>
                <TabsTrigger value="raw">Raw Response</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
              </TabsList>

              {/* Extracted Results */}
              <TabsContent value="extracted" className="space-y-2">
                {result.extracted && result.extracted.length > 0 ? (
                  result.extracted.map(
                    (responseItem: any, responseIdx: number) => (
                      <div key={responseIdx} className="space-y-2">
                        {Object.entries(responseItem).map(
                          ([fieldName, fieldValue]: [string, any]) => {
                            const fieldId = `${responseIdx}-${fieldName}`;
                            const isError =
                              fieldValue &&
                              typeof fieldValue === "object" &&
                              "error" in fieldValue;
                            const displayValue = isError
                              ? fieldValue.error
                              : fieldValue;

                            return (
                              <Collapsible key={fieldId} defaultOpen={false}>
                                <CollapsibleTrigger
                                  className={`flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors hover:bg-muted/80 ${
                                    isError ? "bg-destructive/10" : "bg-muted"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate text-sm font-medium">
                                      {fieldName}
                                    </span>
                                    {isError && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        Error
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="max-w-xs truncate text-xs text-muted-foreground">
                                      {typeof displayValue === "string"
                                        ? displayValue
                                        : JSON.stringify(
                                            displayValue,
                                          ).substring(0, 50)}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 flex-shrink-0 gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(
                                          typeof displayValue === "string"
                                            ? displayValue
                                            : JSON.stringify(
                                                displayValue,
                                                null,
                                                2,
                                              ),
                                          fieldId,
                                        );
                                      }}
                                    >
                                      {copiedField === fieldId ? (
                                        <Check className="h-3 w-3" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-2">
                                  <div
                                    className={`max-h-96 overflow-x-auto overflow-y-auto rounded-lg border p-3 ${isError ? "border-destructive/30 bg-destructive/5" : "border-muted bg-muted/50"}`}
                                  >
                                    <JsonView
                                      src={
                                        typeof displayValue === "string"
                                          ? { value: displayValue }
                                          : displayValue
                                      }
                                      theme={isDark ? "monokai" : "rjv-default"}
                                      collapsed={5}
                                      collapseStringsAfterLength={100}
                                      displayDataTypes={false}
                                      displayObjectSize={true}
                                      name={false}
                                      enableClipboard={true}
                                      style={{
                                        fontSize: "12px",
                                        fontFamily: "monospace",
                                      }}
                                    />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          },
                        )}
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No extracted data
                  </p>
                )}
              </TabsContent>

              {/* Raw Results */}
              <TabsContent value="raw" className="space-y-3">
                {result.raw && result.raw.length > 0 ? (
                  result.raw.map((item: any, idx: number) => (
                    <Collapsible key={idx} defaultOpen={false}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-lg bg-muted p-3 text-left hover:bg-muted/80">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Raw Response {idx + 1}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 flex-shrink-0 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(
                              JSON.stringify(item, null, 2),
                              `raw-${idx}`,
                            );
                          }}
                        >
                          {copiedField === `raw-${idx}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="max-h-[600px] overflow-x-auto overflow-y-auto rounded-lg border border-muted bg-muted p-3">
                          <JsonView
                            src={item}
                            theme={isDark ? "monokai" : "rjv-default"}
                            collapsed={5}
                            collapseStringsAfterLength={100}
                            displayDataTypes={false}
                            displayObjectSize={true}
                            name={false}
                            enableClipboard={true}
                            style={{
                              fontSize: "12px",
                              fontFamily: "monospace",
                            }}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No raw data available
                  </p>
                )}
              </TabsContent>

              {/* Errors */}
              <TabsContent value="errors" className="space-y-3">
                {result.extracted && result.extracted.length > 0 ? (
                  result.extracted.map((item: any, idx: number) => {
                    const hasErrors = Object.values(item).some(
                      (v: any) => v && typeof v === "object" && "error" in v,
                    );
                    if (!hasErrors) return null;

                    return (
                      <Collapsible key={idx}>
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg bg-destructive/10 p-3 text-left hover:bg-destructive/20">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Response {idx + 1} Errors
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="space-y-2">
                            {Object.entries(item).map(
                              ([key, value]: [string, any]) => {
                                if (
                                  value &&
                                  typeof value === "object" &&
                                  "error" in value
                                ) {
                                  return (
                                    <Alert key={key} variant="destructive">
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertDescription>
                                        <strong>{key}:</strong> {value.error}
                                      </AlertDescription>
                                    </Alert>
                                  );
                                }
                                return null;
                              },
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No errors</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
