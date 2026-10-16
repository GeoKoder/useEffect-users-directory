import { useState } from "react";
import useFetch from "./useFetch";

function LoadingSpinner({ message }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p style={{ color: "#6b7280" }}>{message || "Loading..."}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        margin: "16px 0",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        color: "#991b1b",
      }}
    >
      <strong>Error:</strong> {message}
    </div>
  );
}

function UserCard({ user, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        marginBottom: "8px",
        backgroundColor: isSelected ? "#eff6ff" : "#f9fafb",
        border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <strong style={{ fontSize: "15px" }}>{user.name}</strong>
      <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>
        {user.email}
      </div>
    </div>
  );
}

function UserProfile({ userId }) {
  const {
    data: user,
    loading,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const { data: posts, loading: postsLoading } = useFetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
  );

  if (loading) return <LoadingSpinner message="Loading Profile..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: "4px" }}>{user.name}</h2>
      <p style={{ color: "#6b7280", marginTop: 0 }}>@{user.username}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
          >
            Email
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {user.email}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#f0fdf4",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
          >
            Phone
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {user.phone}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#fefce8",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
          >
            Company
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {user.company.name}
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#fdf2f8",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
          >
            City
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {user.address.city}
          </div>
        </div>
      </div>

      <h3>Recent Posts</h3>
      {postsLoading ? (
        <p style={{ color: "#6b7280" }}>Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        <div>
          {posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              style={{
                padding: "12px 16px",
                marginBottom: "8px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h4
                style={{ marginTop: 0, marginBottom: "6px", fontSize: "14px" }}
              >
                {post.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {post.body.slice(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>No posts found.</p>
      )}
    </div>
  );
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    data: users,
    loading,
    error,
  } = useFetch("https://jsonplaceholder.typicode.com/users");
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Users Directory</h1>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: "24px" }}>
        Click a user to view their profile and recent posts.
      </p>

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Left panel: User list */}
        <div style={{ width: "280px", flexShrink: 0 }}>
          <h3 style={{ marginTop: 0 }}>All Users</h3>
          {loading && <LoadingSpinner message="Loading users..." />}
          {error && <ErrorMessage message={error} />}
          {users &&
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={user.id === selectedUserId}
                onClick={() => setSelectedUserId(user.id)}
              />
            ))}
        </div>

        {/* Right panel: User detail */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {selectedUserId ? (
            <UserProfile userId={selectedUserId} />
          ) : (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px dashed #d1d5db",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                No User Selected
              </p>
              <p>Click on a user from the list to iew their profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
