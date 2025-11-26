"use client";

import { useState } from "react";
import { testMetaRequest } from "@/actions/metaRequests";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  FileJson,
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

  // FIX: Separate handlers for different test modes
  const handleTestWithVariables = async () => {
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
        true, // includeRaw
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

  // FIX: Test without any variable overrides
  const handleTestAsIs = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await testMetaRequest(
        request.id,
        undefined, // No variable overrides
        true,
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

  // ENHANCEMENT: Count extracted fields and errors
  const extractedFieldsCount = result?.extracted
    ? Object.keys(result.extracted).length
    : 0;
  const errorCount = result?.extracted
    ? Object.values(result.extracted).filter(
        (v: any) => v && typeof v === "object" && "error" in v,
      ).length
    : 0;

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
                <CardDescription className="mt-1">
                  {Object.keys(bodyVariables).length} variables defined
                </CardDescription>
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
                <Label htmlFor="variables">Variables Override (JSON)</Label>
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

            {/* FIX: Properly differentiated buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleTestWithVariables}
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Test with Variables
              </Button>
              <Button
                onClick={handleTestAsIs}
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Test Results</CardTitle>
              {/* ENHANCEMENT: Quick stats */}
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1">
                  <FileJson className="h-3 w-3" />
                  {extractedFieldsCount} fields
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errorCount} errors
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="extracted">
                  Extracted Fields
                  {extractedFieldsCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {extractedFieldsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="raw">
                  Raw Response
                  {result.raw && (
                    <Badge variant="secondary" className="ml-2">
                      {result.raw.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="errors">
                  Errors
                  {errorCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {errorCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Extracted Results */}
              <TabsContent value="extracted" className="space-y-2">
                {result.extracted || request.fields_to_extract ? (
                  <div className="space-y-2">
                    {/* Get all expected fields from config */}
                    {(() => {
                      const expectedFields = request.fields_to_extract || {};
                      const extractedFields = result.extracted || {};
                      const allFieldNames = Object.keys(expectedFields);

                      return allFieldNames.map((fieldName) => {
                        const fieldValue = extractedFields[fieldName];
                        const hasValue = fieldValue !== undefined;

                        return { fieldName, fieldValue, hasValue };
                      });
                    })().map(({ fieldName, fieldValue, hasValue }) => {
                      const fieldId = `extracted-${fieldName}`;
                      const isError =
                        fieldValue &&
                        typeof fieldValue === "object" &&
                        "error" in fieldValue;
                      const isMissing = !hasValue;
                      const displayValue = isError
                        ? fieldValue.error
                        : fieldValue;

                      // Show array length and type indicators
                      const valueType = !hasValue
                        ? "missing"
                        : Array.isArray(fieldValue)
                          ? `array[${fieldValue.length}]`
                          : typeof fieldValue;

                      return (
                        <Collapsible key={fieldId} defaultOpen={false}>
                          <CollapsibleTrigger
                            className={`flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors hover:bg-muted/80 ${
                              isMissing
                                ? "border border-yellow-500/30 bg-yellow-500/10"
                                : isError
                                  ? "bg-destructive/10"
                                  : "bg-muted"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              <span
                                className={`truncate text-sm font-medium ${
                                  isMissing
                                    ? "text-yellow-600 dark:text-yellow-500"
                                    : ""
                                }`}
                              >
                                {fieldName}
                              </span>
                              {/* Type badge */}
                              <Badge
                                variant="outline"
                                className={`font-mono text-[10px] ${
                                  isMissing
                                    ? "border-yellow-500/50 text-yellow-600 dark:text-yellow-500"
                                    : ""
                                }`}
                              >
                                {valueType}
                              </Badge>
                              {/* Status badges */}
                              {isMissing && (
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-yellow-500/50 text-xs text-yellow-600 dark:text-yellow-500"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  Not Found
                                </Badge>
                              )}
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
                              {!isMissing && (
                                <>
                                  <div className="max-w-xs truncate text-xs text-muted-foreground">
                                    {typeof displayValue === "string"
                                      ? displayValue
                                      : JSON.stringify(displayValue).substring(
                                          0,
                                          50,
                                        )}
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
                                </>
                              )}
                              {isMissing && (
                                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                                  No value extracted
                                </span>
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-2">
                            {isMissing ? (
                              <Alert className="border-yellow-500/30 bg-yellow-500/5">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                                  <strong>Field not found in response.</strong>
                                  <br />
                                  <span className="mt-1 block font-mono text-xs">
                                    JSONPath:{" "}
                                    {request.fields_to_extract[fieldName]}
                                  </span>
                                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                                    <li>
                                      Check if the JSONPath expression is
                                      correct
                                    </li>
                                    <li>
                                      Verify the response structure matches
                                      expectations
                                    </li>
                                    <li>
                                      Field may not exist in this particular
                                      response
                                    </li>
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <div
                                className={`max-h-96 overflow-x-auto overflow-y-auto rounded-lg border p-3 ${
                                  isError
                                    ? "border-destructive/30 bg-destructive/5"
                                    : "border-muted bg-muted/50"
                                }`}
                              >
                                {/* Render primitives as text, objects/arrays with JsonView */}
                                {typeof displayValue === "string" ||
                                typeof displayValue === "number" ||
                                typeof displayValue === "boolean" ? (
                                  <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                                    {String(displayValue)}
                                  </pre>
                                ) : (
                                  <JsonView
                                    src={displayValue}
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
                                )}
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No fields configured for extraction
                  </p>
                )}
              </TabsContent>

              {/* Raw Results */}
              <TabsContent value="raw" className="space-y-3">
                {result.raw && result.raw.length > 0 ? (
                  result.raw.map((item: any, idx: number) => (
                    <Collapsible key={idx} defaultOpen={idx === 0}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-lg bg-muted p-3 text-left hover:bg-muted/80">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Raw Response {idx + 1}
                          </span>
                          {/* ENHANCEMENT: Show if response has errors */}
                          {item.errors && (
                            <Badge variant="destructive" className="text-xs">
                              Has Errors
                            </Badge>
                          )}
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

              {/* FIX: Errors Tab - Fixed to work with object structure */}
              <TabsContent value="errors" className="space-y-3">
                {result.extracted &&
                Object.keys(result.extracted).length > 0 ? (
                  (() => {
                    const errorEntries = Object.entries(
                      result.extracted,
                    ).filter(
                      ([_, value]: [string, any]) =>
                        value && typeof value === "object" && "error" in value,
                    );

                    if (errorEntries.length === 0) {
                      return (
                        <Alert>
                          <Check className="h-4 w-4" />
                          <AlertDescription>
                            No errors found in extracted fields
                          </AlertDescription>
                        </Alert>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {errorEntries.map(([key, value]: [string, any]) => (
                          <Alert key={key} variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong className="font-semibold">{key}:</strong>{" "}
                              {value.error}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No extracted data to check for errors
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
