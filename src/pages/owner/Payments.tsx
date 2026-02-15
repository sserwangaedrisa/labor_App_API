import OwnerLayout from "../../components/layout/OwnerLayout";

const payments = [
  { id: 1, site: "Downtown Project", amount: 3200, status: "Pending" },
  { id: 2, site: "Mall Expansion", amount: 5400, status: "Paid" },
];

const OwnerPayments = () => {
  return (
    <OwnerLayout>
      <h1 className="text-3xl font-bold mb-6">Payment Tracking</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Site</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{payment.site}</td>
                <td className="text-center font-semibold">
                  ${payment.amount}
                </td>
                <td
                  className={`text-center font-semibold ${
                    payment.status === "Pending"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default OwnerPayments;
