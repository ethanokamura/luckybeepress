export default function TestPage() {
  return (
    <main>
      <h1 className="text-4xl font-bold">Test Data</h1>
      <div className="overflow-x-auto rounded-md border border-base-300 shadow-lg bg-base-100">
        <table className="table border-collapse">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th className="text-primary">Key</th>
              <th className="text-primary">Value</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td className="text-secondary">Key</td>
              <td className="text-secondary">Value</td>
            </tr>
            {/* row 2 */}
            <tr>
              <td className="text-secondary">Key</td>
              <td className="text-secondary">Value</td>
            </tr>
            {/* row 3 */}
            <tr>
              <td className="text-secondary">Key</td>
              <td className="text-secondary">Value</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
