// import React from "react";
// import { useState, useEffect, useRef } from "react";
// import Image from "../../../components/ui/AppImage";
// import { format } from "date-fns";
// import LaborCard from "../../../components/ui/LaborCard";
// import {
//   Calendar,
//   DollarSign,
//   Clock,
//   Briefcase,
//   Mail,
//   Phone,
//   MapPin,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
// } from "lucide-react";
// import Icon from "../../../components/ui/AppIconl";
// import type { WorkEntry, WorkerPaymentData } from "../../../types/SharedTypes";
// import toast from "react-hot-toast";
// import authorizePostRequest from "../../../api/authorizePostRequest";

// interface SearchObject {
//   startDate: Date;
//   siteId: string;
//   endDate: Date;
//   workerId: string;
// }

// interface workerRequestResponse {
//   data?: WorkerPaymentData;
//   success: boolean;
//   message: string;
// }

// interface WorkerModalProps {
//   isOpen: boolean;
//   searchQuery: SearchObject;
//   onClose: () => void;
// }

// const WorkerModal: React.FC<WorkerModalProps> = ({
//   isOpen,
//   searchQuery,
//   onClose,
// }) => {
//   const [worker, setWorker] = useState<WorkerPaymentData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showLaborCard, setShowLaborCard] = useState(false); // SHOWING LABOR CARD FOR WORKERS

//   // Use refs to track request state
//   const isFetchingRef = useRef(false);
//   const lastRequestKeyRef = useRef<string>("");
//   const abortControllerRef = useRef<AbortController | null>(null);

//   // Unique key for the current search query
//   const getRequestKey = (query: SearchObject) => {
//     return `${query.siteId}-${query.workerId}-${query.startDate?.toISOString().split("T")[0]}}`;
//   };

//   // Effect to reset state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       // Cancel any ongoing request when modal closes
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//         abortControllerRef.current = null;
//       }
//       isFetchingRef.current = false;
//     }
//   }, [isOpen]);

//   // Effect to fetch worker details
//   useEffect(() => {
//     if (!isOpen) return;

//     if (!searchQuery.siteId?.length || !searchQuery.workerId?.length) return;

//     const requestKey = getRequestKey(searchQuery);

//     if (isFetchingRef.current && lastRequestKeyRef.current === requestKey) {
//       console.log("Already fetching this data, skipping...");
//       return;
//     }

//     if (worker && lastRequestKeyRef.current === requestKey) {
//       console.log("Data already loaded for this request, skipping...");
//       return;
//     }

//     const fetchWorkerDetails = async () => {
//       // Cancel any ongoing request
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }

//       // Create new abort controller
//       abortControllerRef.current = new AbortController();

//       isFetchingRef.current = true;
//       lastRequestKeyRef.current = requestKey;
//       setIsLoading(true);

//       try {
//         const response = await authorizePostRequest<workerRequestResponse>(
//           "payments/workerPayment",
//           searchQuery,
//         );

//         // Check if this request was aborted
//         if (abortControllerRef.current?.signal.aborted) {
//           console.log("Request was aborted");
//           return;
//         }

//         if (!response.success || !response) {
//           console.log(response.message || "failed to get user data");
//           toast.error(response.message || "Failed to get the worker details");
//           setWorker(null);
//           return;
//         }

//         // Only update state if the request key still matches (avoid race conditions)
//         if (lastRequestKeyRef.current === requestKey) {
//           setWorker(response?.data ? response.data : null);
//         }
//       } catch (error: any) {
//         // Don't show error if request was aborted
//         if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
//           console.log("Request was cancelled");
//           return;
//         }
//         console.log("error while getting site details", error);
//         toast.error("Failed to get workers details");
//         setWorker(null);
//       } finally {
//         // Only reset if this is still the current request
//         if (lastRequestKeyRef.current === requestKey) {
//           isFetchingRef.current = false;
//           setIsLoading(false);
//           abortControllerRef.current = null;
//         }
//       }
//     };

//     fetchWorkerDetails();

//     // Cleanup function
//     return () => {
//       // Don't abort here as it would cancel the request for subsequent renders
//       // We'll handle abort in the next effect run
//     };
//   }, [
//     isOpen,
//     searchQuery.siteId,
//     searchQuery.workerId,
//     searchQuery.startDate,
//     searchQuery.endDate,
//   ]);

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "MMM dd, yyyy");
//     } catch {
//       return dateString;
//     }
//   };

//   const formatHours = (hours: number) => {
//     return `${hours.toFixed(2)} hrs`;
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case "rejected":
//         return <XCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 shadow-2xl transition-all animate-in fade-in zoom-in duration-300"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header with gradient background */}
//         <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
//           <div className="flex items-center gap-4">
//             <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
//               <Image
//                 src={worker?.worker?.imageUrl || "/avatar.png"}
//                 alt={worker?.worker?.name}
//                 width={80}
//                 height={80}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-white">
//                 {worker?.worker?.name || "Loading..."}
//               </h2>
//               <p className="text-blue-100 flex items-center gap-2 mt-1">
//                 <Briefcase className="w-4 h-4" />
//                 <Icon name="Briefcase" className="w-4 h-4" />
//                 {worker?.worker?.job || worker?.worker?.role || "Worker"}
//               </p>
//               <p className="text-blue-100 text-sm mt-1">{worker?.site?.name}</p>
//             </div>

//             <button
//               onClick={onClose}
//               className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="p-6 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading worker details...</p>
//           </div>
//         )}

//         {/* Content */}
//         {!isLoading && worker && (
//           <div className="p-6 space-y-6">
//             {/* Period Badge */}
//             <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
//               <p className="text-sm text-blue-700 font-medium">
//                 Payment Period: {formatDate(worker?.period.startDate || "")} -{" "}
//                 {formatDate(worker?.period.endDate || new Date().toISOString())}
//               </p>
//             </div>

//             {/* Worker Details Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                 <Mail className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <p className="text-xs text-gray-500">Email</p>
//                   <p className="text-sm font-medium text-gray-700">
//                     {worker?.worker?.email}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <p className="text-xs text-gray-500">Rate per Hour</p>
//                   <p className="text-sm font-medium text-gray-700">
//                     ${worker?.calculation.ratePerHour}/hr
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Summary Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
//                 <div className="flex justify-center mb-2">
//                   <Clock className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <p className="text-2xl font-bold text-blue-900">
//                   {formatHours(worker?.summary.totalRegularHours || 0)}
//                 </p>
//                 <p className="text-xs text-blue-700 font-medium">
//                   Regular Hours
//                 </p>
//               </div>

//               <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
//                 <div className="flex justify-center mb-2">
//                   <TrendingUp className="w-6 h-6 text-orange-600" />
//                 </div>
//                 <p className="text-2xl font-bold text-orange-900">
//                   {formatHours(worker?.summary.totalOvertimeHours || 0)}
//                 </p>
//                 <p className="text-xs text-orange-700 font-medium">
//                   Overtime Hours
//                 </p>
//               </div>

//               <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
//                 <div className="flex justify-center mb-2">
//                   <Calendar className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <p className="text-2xl font-bold text-purple-900">
//                   {worker?.metadata.entryCount}
//                 </p>
//                 <p className="text-xs text-purple-700 font-medium">Work Days</p>
//               </div>

//               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
//                 <div className="flex justify-center mb-2">
//                   <DollarSign className="w-6 h-6 text-green-600" />
//                 </div>
//                 <p className="text-2xl font-bold text-green-900">
//                   ${worker?.summary.totalAmount}
//                 </p>
//                 <p className="text-xs text-green-700 font-medium">
//                   Total Earnings
//                 </p>
//               </div>
//             </div>

//             {/* Detailed Breakdown */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                 <Clock className="w-5 h-5" />
//                 Work Entries Breakdown
//               </h3>
//               <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-gray-600 font-semibold">
//                           Date
//                         </th>
//                         <th className="px-4 py-3 text-right text-gray-600 font-semibold">
//                           Regular
//                         </th>
//                         <th className="px-4 py-3 text-right text-gray-600 font-semibold">
//                           Overtime
//                         </th>
//                         <th className="px-4 py-3 text-right text-gray-600 font-semibold">
//                           Total
//                         </th>
//                         <th className="px-4 py-3 text-right text-gray-600 font-semibold">
//                           Amount
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {worker?.entries?.map((entry, index) => (
//                         <tr
//                           key={entry.id}
//                           className="hover:bg-gray-100 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-gray-700">
//                             {formatDate(new Date(entry.date).toISOString())}
//                           </td>
//                           <td className="px-4 py-3 text-right text-gray-700">
//                             {formatHours(entry.hours ? entry.hours : 0)}
//                           </td>
//                           <td className="px-4 py-3 text-right text-gray-700">
//                             {formatHours(entry.overtime ? entry.overtime : 0)}
//                           </td>
//                           <td className="px-4 py-3 text-right font-medium text-gray-800">
//                             {formatHours(
//                               entry.totalHours ? entry.totalHours : 0,
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-right font-medium text-green-600">
//                             ${entry.amount ? entry.amount : 0}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-100 font-semibold">
//                       <tr>
//                         <td className="px-4 py-3 text-gray-800">Total</td>
//                         <td className="px-4 py-3 text-right text-gray-800">
//                           {formatHours(worker?.summary.totalRegularHours || 0)}
//                         </td>
//                         <td className="px-4 py-3 text-right text-gray-800">
//                           {formatHours(worker?.summary.totalOvertimeHours || 0)}
//                         </td>
//                         <td className="px-4 py-3 text-right text-gray-800">
//                           {formatHours(worker?.summary.totalHours || 0)}
//                         </td>
//                         <td className="px-4 py-3 text-right text-green-700">
//                           ${worker?.summary.totalAmount || 0}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             {/* Calculation Info */}
//             <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
//               <p className="text-xs text-blue-700 font-mono">
//                 {worker?.calculation.formula} = $
//                 {worker?.calculation.wageRating}
//                 /hr × {formatHours(worker?.summary.totalHours || 0)}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Footer Actions */}
//         <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium transition-all duration-200"
//             >
//               Close
//             </button>
//             {/* <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
//               Download Report
//             </button> */}
//             <button
//               onClick={() => setShowLaborCard(true)}
//               className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               Show Labor Card
//             </button>
//           </div>
//         </div>
//       </div>

//       <LaborCard
//         isOpen={showLaborCard}
//         workerData={worker || null}
//         onClose={() => setShowLaborCard(false)}
//       />
//     </div>
//   );
// };

// export default WorkerModal;

import React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "../../../components/ui/AppImage";
import { format } from "date-fns";
import LaborCard from "../../../components/ui/LaborCard";
import {
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Icon from "../../../components/ui/AppIconl";
import type { WorkEntry, WorkerPaymentData } from "../../../types/SharedTypes";
import toast from "react-hot-toast";
import authorizePostRequest from "../../../api/authorizePostRequest";

interface SearchObject {
  startDate: Date;
  siteId: string;
  endDate: Date;
  workerId: string;
}

interface workerRequestResponse {
  data?: WorkerPaymentData;
  success: boolean;
  message: string;
}

interface WorkerModalProps {
  isOpen: boolean;
  searchQuery: SearchObject;
  onClose: () => void;
}

const WorkerModal: React.FC<WorkerModalProps> = ({
  isOpen,
  searchQuery,
  onClose,
}) => {
  const [worker, setWorker] = useState<WorkerPaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLaborCard, setShowLaborCard] = useState(false);

  // Use refs to track request state
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Memoize the request key to prevent unnecessary recalculations
  const requestKey = useMemo(() => {
    if (!searchQuery.siteId || !searchQuery.workerId) return "";
    return `${searchQuery.siteId}-${searchQuery.workerId}-${searchQuery.startDate?.toISOString().split("T")[0]}-${searchQuery.endDate?.toISOString().split("T")[0]}`;
  }, [
    searchQuery.siteId,
    searchQuery.workerId,
    searchQuery.startDate,
    searchQuery.endDate,
  ]);

  // Cleanup function to cancel all pending operations
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    isFetchingRef.current = false;
  }, []);

  // Effect to reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      // Clear worker data when modal closes to free memory
      setWorker(null);
    }
  }, [isOpen, cleanup]);

  // Effect to fetch worker details
  useEffect(() => {
    if (!isOpen) return;
    if (!searchQuery.siteId?.length || !searchQuery.workerId?.length) return;

    // Don't fetch if we're already fetching the same data
    if (isFetchingRef.current && lastRequestKeyRef.current === requestKey) {
      return;
    }

    // Don't fetch if we already have the data
    if (worker && lastRequestKeyRef.current === requestKey) {
      return;
    }

    const fetchWorkerDetails = async () => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      isFetchingRef.current = true;
      lastRequestKeyRef.current = requestKey;
      setIsLoading(true);

      try {
        const response = await authorizePostRequest<workerRequestResponse>(
          "payments/workerPayment",
          searchQuery,
          { signal: abortControllerRef.current.signal },
        );

        // Check if this request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (!response.success || !response) {
          toast.error(response.message || "Failed to get the worker details");
          setWorker(null);
          return;
        }

        // Only update state if the request key still matches
        if (lastRequestKeyRef.current === requestKey && response?.data) {
          setWorker(response.data);
        }
      } catch (error: any) {
        // Don't show error if request was aborted
        if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
          return;
        }
        console.error("Error fetching worker details:", error);
        toast.error("Failed to get workers details");
        setWorker(null);
      } finally {
        // Only reset if this is still the current request
        if (lastRequestKeyRef.current === requestKey) {
          isFetchingRef.current = false;
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      }
    };

    // Add a small delay to prevent rapid successive calls
    timeoutRef.current = setTimeout(() => {
      fetchWorkerDetails();
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, requestKey, searchQuery, worker]);

  // Memoize formatters to prevent recreation on each render
  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const formatHours = useCallback((hours: number) => {
    return `${hours.toFixed(2)} hrs`;
  }, []);

  const getStatusIcon = useCallback((status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  }, []);

  // Memoize entries table to prevent unnecessary re-renders
  const entriesTable = useMemo(() => {
    if (!worker?.entries?.length) return null;

    return (
      <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">
                  Regular
                </th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">
                  Overtime
                </th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {worker.entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(new Date(entry.date).toISOString())}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatHours(entry.hours || 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatHours(entry.overtime || 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {formatHours(entry.totalHours || 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">
                    ${entry.amount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td className="px-4 py-3 text-gray-800">Total</td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {formatHours(worker.summary.totalRegularHours || 0)}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {formatHours(worker.summary.totalOvertimeHours || 0)}
                </td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {formatHours(worker.summary.totalHours || 0)}
                </td>
                <td className="px-4 py-3 text-right text-green-700">
                  ${worker.summary.totalAmount || 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }, [worker, formatDate, formatHours]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 shadow-2xl transition-all animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white flex-shrink-0">
                <Image
                  src={worker?.worker?.imageUrl || "/avatar.png"}
                  alt={worker?.worker?.name || "Worker"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate">
                  {worker?.worker?.name || "Loading..."}
                </h2>
                <p className="text-blue-100 flex items-center gap-2 mt-1 truncate">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {worker?.worker?.job || worker?.worker?.role || "Worker"}
                  </span>
                </p>
                <p className="text-blue-100 text-sm mt-1 truncate">
                  {worker?.site?.name}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading worker details...</p>
            </div>
          )}

          {/* Content */}
          {!isLoading && worker && (
            <div className="p-6 space-y-6">
              {/* Period Badge */}
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">
                  Payment Period: {formatDate(worker.period.startDate || "")} -{" "}
                  {formatDate(
                    worker.period.endDate || new Date().toISOString(),
                  )}
                </p>
              </div>

              {/* Worker Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-0">
                  <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {worker.worker?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Rate per Hour</p>
                    <p className="text-sm font-medium text-gray-700">
                      ${worker.calculation.ratePerHour}/hr
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatHours(worker.summary.totalRegularHours || 0)}
                  </p>
                  <p className="text-xs text-blue-700 font-medium">
                    Regular Hours
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatHours(worker.summary.totalOvertimeHours || 0)}
                  </p>
                  <p className="text-xs text-orange-700 font-medium">
                    Overtime Hours
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {worker.metadata.entryCount}
                  </p>
                  <p className="text-xs text-purple-700 font-medium">
                    Work Days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    ${worker.summary.totalAmount}
                  </p>
                  <p className="text-xs text-green-700 font-medium">
                    Total Earnings
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Work Entries Breakdown
                </h3>
                {entriesTable}
              </div>

              {/* Calculation Info */}
              <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-blue-700 font-mono break-all">
                  {worker.calculation.formula} = $
                  {worker.calculation.wageRating}
                  /hr × {formatHours(worker.summary.totalHours || 0)}
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl sticky bottom-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setShowLaborCard(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Show Labor Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Labor Card Modal */}
      {showLaborCard && (
        <LaborCard
          isOpen={showLaborCard}
          workerData={worker}
          onClose={() => setShowLaborCard(false)}
        />
      )}
    </>
  );
};

export default React.memo(WorkerModal);
