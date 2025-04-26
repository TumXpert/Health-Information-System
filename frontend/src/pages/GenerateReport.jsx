import React from 'react';

export default function GenerateReport() {
  const handleGenerateReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/generate');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'enrollment_report.csv'; // file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('✅ Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Failed to generate report.');
    }
  };

  return (
    <div className="d-flex justify-content-center my-4">
      <button
        className="btn btn-primary btn-lg"
        onClick={handleGenerateReport}
      >
        📄 Generate Enrollment Report
      </button>
    </div>
  );
}
