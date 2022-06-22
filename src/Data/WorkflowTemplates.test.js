import WorkflowTemplates from "./WorkflowTemplates";

it("should have at least one workflow template", () => {
    expect(WorkflowTemplates.length).toBeGreaterThan(0);
});