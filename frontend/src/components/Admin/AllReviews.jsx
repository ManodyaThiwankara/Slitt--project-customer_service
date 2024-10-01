import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import { server } from "../../server";

const AllReviews = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  // Fetch review data on component mount
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
        setFilteredData(res.data.products); // Initialize filtered data
        console.log(res.data.products);
      })
      .catch((error) => {
        console.error("Error loading reviews:", error);
      });
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      console.log("Review ID to delete:", reviewId); // Log the reviewId to confirm
      const response = await axios.delete(
        `${server}/product/admin-delete-review`,
        { withCredentials: true }
      );
      console.log("API response:", response.data); // Log the response data
      // Rest of your delete logic...
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on product name or shop name
    const filtered = data.filter((item) => {
      const productName = item.name.toLowerCase();
      const shopName = item.shop.name.toLowerCase();
      return (
        productName.includes(query) || shopName.includes(query)
      );
    });
    setFilteredData(filtered);
  };

  // Prepare row data for the DataGrid
  const rows = [];
  filteredData.forEach((item) => {
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
    doc.setFontSize(16);
    doc.text("All Reviews Report (products have user reviews)", 14, 16); // Title of the report
    doc.setFontSize(12);

    const tableColumn = ["Product Name", "Shop Name", "Rating"]; // Adjusted columns
    const tableRows = [];

    // Populate the table rows with relevant data
    data.forEach((item) => {
      const shopName = item.shop?.name || "Unknown Shop"; // Ensure shop name is defined
      const averageRating = item.ratings ? item.ratings.toFixed(2) : "0"; // Average rating, formatted to 2 decimal places

      // Only include product name, shop name, and rating in the rows
      const reviewData = [item.name, shopName, averageRating];
      tableRows.push(reviewData);
    });

    // Create the table in the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22, // Start position on the Y-axis
    });

    // Save the PDF locally
    doc.save("all_reviews_report.pdf");
  };

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <TextField
        label="Search by Product or Shop Name"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
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
