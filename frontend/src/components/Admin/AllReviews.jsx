import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AllReviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsWithReviews = async () => {
      try {
        const response = await axios.get('/api/products/reviews'); // Adjust the endpoint if needed
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProductsWithReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error}</p>;

  return (
    <div>
      <h2>All Product Reviews</h2>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h4>Reviews:</h4>
            {product.reviews.map((review) => (
              <div key={review._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
                <div>
                  <strong>{review.user.name}</strong> rated {review.rating} stars
                </div>
                <p>{review.comment}</p>
                <small>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default AllReviews;
