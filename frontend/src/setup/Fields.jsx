export const QuestionField = ({ q, value, onChange }) => {
  const id = `setup-${q.path.replace(/[^a-z0-9]+/gi, "-")}`;
  const inputValue = value === "Upload needed." ? "" : value || "";
  const props = { id, value: inputValue, "data-testid": `${id}-input`, placeholder: "Upload needed.", onChange: (e) => onChange(q.path, e.target.value), className: "mt-2 w-full rounded-lg border border-line/15 bg-bg/50 p-3 text-base leading-relaxed" };
  return <div data-testid={id}><label htmlFor={id} className="text-sm font-medium text-tx-hi">{q.label}</label>{q.type === "input" ? <input {...props} type="text" /> : <textarea {...props} rows={3} />}</div>;
};