// import Image from "next/image";
// import React from "react";

// const reviews = [
//    {
//       id: 1,
//       user: "kim****",
//       date: "2024-07-01",
//       rating: 5,
//       text: `튼튼대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~
// 나중에 또 집 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!
// 비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)`,
//    },
//    {
//       id: 2,
//       user: "kim****",
//       date: "2024-07-01",
//       rating: 5,
//       text: `기사님 덕분에 안전하고 신속한 이사를 했습니다! 정말 감사합니다~`,
//    },
// ];

// export default function MyPage() {
//    const counts: Record<5 | 4 | 3 | 2 | 1, number> = {
//       5: 170,
//       4: 8,
//       3: 0,
//       2: 0,
//       1: 0,
//    };

//    return (
//       <div
//          className="mypage-container"
//          style={{
//             maxWidth: 720,
//             margin: "0 auto",
//             padding: 20,
//             fontFamily: "Arial, sans-serif",
//          }}
//       >
//          {/* 프로필 요약 */}
//          <section
//             style={{
//                backgroundColor: "#ffe4e6",
//                borderRadius: 10,
//                padding: 20,
//                marginBottom: 30,
//             }}
//          >
//             <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//                <Image
//                   src="https://i.imgur.com/UZDYJrG.png"
//                   alt="프로필"
//                   width={80}
//                   height={80}
//                   style={{ borderRadius: "50%" }}
//                />
//                <div>
//                   <h2 style={{ margin: 0, fontWeight: "bold" }}>김코드</h2>
//                   <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
//                      고객님의 물품을 소중하고 안전하게 운송하여 드립니다.
//                   </p>
//                   <div style={{ marginTop: 10, fontSize: 14 }}>
//                      <span style={{ fontWeight: "bold", color: "#f59e0b" }}>
//                         ★ 5.0
//                      </span>{" "}
//                      (178) ㆍ 경력 7년 ㆍ 334건 확정
//                   </div>
//                   <div style={{ marginTop: 5, fontSize: 14 }}>
//                      제공 서비스: <strong>소형이사, 가정이사</strong> ㆍ 지역:
//                      서울, 경기
//                   </div>
//                </div>
//             </div>
//          </section>

//          {/* 리뷰 평점 요약 */}
//          <section
//             style={{
//                backgroundColor: "#f9fafb",
//                borderRadius: 10,
//                padding: 20,
//                marginBottom: 30,
//             }}
//          >
//             <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
//                <div
//                   style={{ fontSize: 48, fontWeight: "bold", color: "#f59e0b" }}
//                >
//                   5.0
//                </div>
//                <div style={{ flex: 1 }}>
//                   {([5, 4, 3, 2, 1] as const).map((score) => (
//                      <div
//                         key={score}
//                         style={{
//                            display: "flex",
//                            alignItems: "center",
//                            gap: 8,
//                            marginBottom: 4,
//                         }}
//                      >
//                         <span>{score}점</span>
//                         <div
//                            style={{
//                               flex: 1,
//                               height: 6,
//                               background: "#ddd",
//                               borderRadius: 3,
//                               overflow: "hidden",
//                            }}
//                         >
//                            <div
//                               style={{
//                                  width: `${(counts[score] / 178) * 100}%`,
//                                  height: "100%",
//                                  backgroundColor: "#f59e0b",
//                               }}
//                            />
//                         </div>
//                         <span>{counts[score]}</span>
//                      </div>
//                   ))}
//                </div>
//             </div>
//          </section>

//          {/* 리뷰 리스트 */}
//          <section>
//             <h3 style={{ fontWeight: "bold", marginBottom: 16 }}>
//                리뷰 ({reviews.length})
//             </h3>
//             {reviews.map((review) => (
//                <div
//                   key={review.id}
//                   style={{
//                      marginBottom: 24,
//                      borderBottom: "1px solid #eee",
//                      paddingBottom: 16,
//                   }}
//                >
//                   <div
//                      style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 10,
//                         marginBottom: 8,
//                      }}
//                   >
//                      <strong>{review.user}</strong>
//                      <span style={{ color: "#999", fontSize: 12 }}>
//                         {review.date}
//                      </span>
//                   </div>
//                   <div style={{ color: "#f59e0b" }}>
//                      {"★".repeat(review.rating)}
//                      {"☆".repeat(5 - review.rating)}
//                   </div>
//                   <p style={{ whiteSpace: "pre-line", marginTop: 8 }}>
//                      {review.text}
//                   </p>
//                </div>
//             ))}
//          </section>
//       </div>
//    );
// }
