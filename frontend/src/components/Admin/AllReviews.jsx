import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import { server } from "../../server";

const AllReviews = () => {
  const [data, setData] = useState([]);

  // Fetch review data on component mount
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
        console.log(res.data.products);
      })
      .catch((error) => {
        console.error("Error loading reviews:", error);
      });
  }, []);

  // Function to delete a review
  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${server}/product/review/${reviewId}`, { withCredentials: true });
      // Remove the deleted review from state
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          reviews: item.reviews.filter((review) => review._id !== reviewId),
        }))
      );
      console.log("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Prepare row data for the DataGrid
  const rows = [];
  data.forEach((item) => {
    // Push main product row
    rows.push({
      id: item._id,
      product: item.name,
      user: item.shop.name,
      rating: item.ratings,
      comment: "",
      isProductRow: true, // Flag to differentiate product rows
    });

    // Push each review as a separate row
    item.reviews.forEach((review) => {
      rows.push({
        id: review._id,
        product: "", // Empty for review rows
        user: review.user.name || "Anonymous", // Display user's name
        rating: review.rating,
        comment: review.comment,
        isProductRow: false, // Flag for review rows
        reviewId: review._id, // Keep review ID for deletion
      });
    });
  });

  // Define table columns
  const columns = [
    { field: "product", headerName: "Product Name", minWidth: 180, flex: 1.4 },
    { field: "user", headerName: "User / Shop Name", minWidth: 180, flex: 1.4 },
    { field: "rating", headerName: "Rating", minWidth: 100, flex: 0.6, type: "number" },
    { field: "comment", headerName: "Comment", minWidth: 200, flex: 1.5 },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        if (!params.row.isProductRow) {
          return (
            <Button
              onClick={() => handleDelete(params.row.reviewId)}
              style={{ color: "red" }}
            >
              <AiOutlineDelete size={20} />
            </Button>
          );
        }
        return null; // Do not show delete button for product rows
      },
    },
  ];

  // PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("All Reviews Report", 14, 16);

    const tableColumn = ["Review Id", "Product Name", "User Name", "Rating", "Comment"];
    const tableRows = [];

    data.forEach((item) => {
      item.reviews.forEach((review) => {
        const reviewData = [
          review._id,
          item.name,
          review.user.name || "Anonymous", // Display user's name
          review.rating,
          review.comment,
        ];
        tableRows.push(reviewData);
      });
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
    });

    doc.save("all_reviews_report.pdf");
  };

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        getRowClassName={(params) =>
          params.row.isProductRow ? "product-row" : "review-row"
        }
      />
      <div className="flex justify-end mt-4">
        <Button variant="contained" color="primary" onClick={generatePDF}>
          Generate PDF Report
        </Button>
      </div>

      <style jsx>{`
        .product-row {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .review-row {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default AllReviews;
