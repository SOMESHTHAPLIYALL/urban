import React from "react";

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah M.",
      date: "2024-03-15",
      review: "Amazing car and very accommodating owner. The vehicle was spotless and in perfect condition.",
      rating: 5,
    },
    {
      name: "John D.",
      date: "2024-03-14",
      review: "Great experience! The car was well-maintained and the owner was very responsive.",
      rating: 4,
    },
  ];

  return (
    <div className="container mx-auto my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Car Owner Reviews</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-md rounded hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{review.name}</h3>
            <p className="text-gray-600 text-sm">{review.date}</p>
            <p className="mt-2">{review.review}</p>
            <p className="mt-4 text-yellow-500">
              {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
