function StudentDashboard() {
    return (
        <div
            style={
                {
                    // Regular styles
                    color: "var(--d2l-color-ferrite)" as any,
                    fontFamily: "Lato, Lucida Sans Unicode, Lucida Grande, sans-serif",
                    fontWeight: 400,
                    letterSpacing: ".01rem",
                    fontSize: "100%",
                    lineHeight: 1,
                    borderBottom: "1px solid rgba(124, 134, 149, 0.18)",
                    borderTop: "1px solid rgba(124, 134, 149, 0.18)",
                    display: "block",
                    backgroundColor: "#990000",

                    // optional: make it look less cramped
                    padding: "16px",
                } as React.CSSProperties
            }
        >
            <h1>Student Dashboard</h1>
        </div>
    );
}

export default StudentDashboard;
