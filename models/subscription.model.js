import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: 0,
    },
    currency: {
      type: String,
      enum: [
        // Major Global
        "USD", // US Dollar
        "EUR", // Euro
        "GBP", // British Pound
        "JPY", // Japanese Yen
        "CHF", // Swiss Franc
        "CAD", // Canadian Dollar
        "AUD", // Australian Dollar
        "NZD", // New Zealand Dollar

        // Americas
        "BRL", // Brazilian Real
        "MXN", // Mexican Peso
        "ARS", // Argentine Peso
        "CLP", // Chilean Peso
        "COP", // Colombian Peso

        // Europe (non-Euro)
        "SEK", // Swedish Krona
        "NOK", // Norwegian Krone
        "DKK", // Danish Krone
        "PLN", // Polish Zloty
        "CZK", // Czech Koruna
        "HUF", // Hungarian Forint
        "RON", // Romanian Leu

        // Asia-Pacific
        "CNY", // Chinese Yuan
        "INR", // Indian Rupee
        "KRW", // South Korean Won
        "SGD", // Singapore Dollar
        "HKD", // Hong Kong Dollar
        "TWD", // Taiwan Dollar
        "THB", // Thai Baht
        "MYR", // Malaysian Ringgit
        "IDR", // Indonesian Rupiah
        "PHP", // Philippine Peso
        "VND", // Vietnamese Dong

        // Middle East & Africa
        "AED", // UAE Dirham
        "SAR", // Saudi Riyal
        "ILS", // Israeli Shekel
        "TRY", // Turkish Lira
        "ZAR", // South African Rand
        "EGP", // Egyptian Pound
        "NGN", // Nigerian Naira
      ],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Entertainment",
        "Gaming",
        "Software",
        "Cloud",
        "Music",
        "News",
        "Education",
        "Fitness",
        "Food",
        "Shopping",
        "Finance",
        "VPN & Security",
        "Productivity",
        "Communication",
        "Storage",
        "AI Tools",
        "Other",
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Auto-calculate renewal date
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency],
    );
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
