/**
 * Guest Bottom Sheet - Example Usage
 *
 * This file demonstrates how to use the GuestBottomSheet component
 * You can copy and adapt this pattern for your specific use cases
 */

import React, { useState } from "react";
import { GuestBottomSheet } from "./GuestBottomSheet";

/**
 * Example 1: Simple Bottom Sheet with Title
 */
export function ExampleSimpleBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
      >
        Open Bottom Sheet
      </button>

      <GuestBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Title"
      >
        <div className="p-6">
          <p className="text-gray-700">Your content goes here...</p>
        </div>
      </GuestBottomSheet>
    </>
  );
}

/**
 * Example 2: Bottom Sheet with Custom Content (e.g., Menu Items)
 */
export function ExampleMenuBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, name: "Breakfast", price: "$12.00" },
    { id: 2, name: "Lunch", price: "$18.00" },
    { id: 3, name: "Dinner", price: "$25.00" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
      >
        View Menu
      </button>

      <GuestBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Restaurant Menu"
        maxHeight="80vh"
      >
        <div className="divide-y divide-gray-200">
          {menuItems.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <span className="text-emerald-600 font-semibold">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GuestBottomSheet>
    </>
  );
}

/**
 * Example 3: Bottom Sheet without Title (Only Handle Bar)
 */
export function ExampleNoTitleBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
      >
        Open Without Title
      </button>

      <GuestBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Custom Header
          </h2>
          <p className="text-gray-700">
            When you don't provide a title prop, you can create your own custom
            header inside the children.
          </p>
        </div>
      </GuestBottomSheet>
    </>
  );
}

/**
 * Example 4: Bottom Sheet with Form
 */
export function ExampleFormBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
      >
        Contact Us
      </button>

      <GuestBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Reception"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="How can we help you?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </GuestBottomSheet>
    </>
  );
}
