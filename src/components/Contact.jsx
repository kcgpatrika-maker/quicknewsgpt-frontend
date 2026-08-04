import React from "react";

export default function Contact() {
  return (
    <div
      className="card"
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        lineHeight: "1.8",
      }}
    >
      <h1>Contact Us</h1>

      <p>
        Thank you for visiting <strong>Quick NewsGPT</strong>. We welcome your
        feedback, suggestions, corrections and general inquiries. Your valuable
        opinions help us improve our platform and provide a better experience
        for our readers.
      </p>

      <h2>Get in Touch</h2>

      <p>
        If you have any questions regarding our content, website, privacy
        policy, copyright matters or any other issue, please contact us through
        the email below.
      </p>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:quicknewsgpt@gmail.com">
          quicknewsgpt@gmail.com
        </a>
      </p>

      <h2>Response Time</h2>

      <p>
        We try to respond to all genuine inquiries within 24 to 48 hours.
        Response times may vary depending on weekends, holidays or the number
        of requests received.
      </p>

      <h2>Feedback</h2>

      <p>
        We appreciate your suggestions regarding website improvements, news
        coverage, features and user experience. Constructive feedback helps us
        make Quick NewsGPT more useful for everyone.
      </p>

      <h2>Business & General Queries</h2>

      <p>
        For business inquiries, partnerships or any general communication,
        please contact us through the email provided above.
      </p>

      <p>
        Thank you for supporting <strong>Quick NewsGPT</strong>.
      </p>
    </div>
  );
}
