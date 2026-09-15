import { LegalPage, LegalSection } from "./legal-page";

export function FaqView() {
  return (
    <LegalPage title="Câu hỏi thường gặp" updated="15/09/2026">
      <LegalSection title="SoFilm là gì?">
        <p>
          SoFilm là nền tảng xem phim, series và video ngắn (Shorts) trực tuyến. Bạn có thể xem
          một phần nội dung miễn phí, hoặc nâng cấp lên gói VIP để mở khoá toàn bộ thư viện phim
          và series chất lượng cao.
        </p>
      </LegalSection>

      <LegalSection title="Xem phim có mất phí không?">
        <p>
          Một phần nội dung (danh mục, xem thử, video ngắn) miễn phí cho tất cả người dùng đã
          đăng ký tài khoản. Nội dung Premium — bao gồm phần lớn phim và series mới — yêu cầu gói
          VIP trả phí, xem chi tiết các gói tại trang{" "}
          <a href="/subscription" className="text-brand hover:underline">
            Subscription
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Thanh toán gói VIP bằng cách nào?">
        <p>
          SoFilm hiện nhận thanh toán qua <span className="text-white/90">chuyển khoản ngân
          hàng</span> — hệ thống tự tạo mã QR (VietQR) kèm mã tham chiếu riêng cho mỗi giao dịch.
          Bạn quét mã bằng app ngân hàng hoặc chuyển khoản thủ công, giữ đúng nội dung chuyển
          khoản (mã tham chiếu) để hệ thống tự động đối soát.
        </p>
        <p>
          Tài khoản của bạn thường được kích hoạt <span className="text-white/90">trong vòng
          1-2 phút</span> sau khi chuyển khoản thành công. Nếu quá lâu chưa thấy kích hoạt, vui
          lòng liên hệ hỗ trợ kèm ảnh chụp giao dịch để được xử lý thủ công.
        </p>
        <p>Các phương thức khác (MoMo, VNPay, thẻ quốc tế, ZaloPay) đang được phát triển.</p>
      </LegalSection>

      <LegalSection title="Tôi có thể huỷ gói hoặc yêu cầu hoàn tiền không?">
        <p>
          Gói VIP có hiệu lực trong đúng thời hạn đã mua, không tự động gia hạn. Chúng tôi hiện
          chưa có cơ chế hoàn tiền tự động; nếu bạn gặp sự cố về thanh toán hoặc chất lượng dịch
          vụ, vui lòng liên hệ email hỗ trợ để được xem xét từng trường hợp cụ thể — xem thêm tại
          trang{" "}
          <a href="/terms-of-service" className="text-brand hover:underline">
            Điều khoản sử dụng
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Tôi có thể xem trên bao nhiêu thiết bị?">
        <p>
          Tài khoản của bạn dùng chung cho mọi thiết bị đăng nhập — trình duyệt web trên máy
          tính, điện thoại, hoặc tablet. SoFilm hiện chưa có ứng dụng di động riêng; truy cập qua
          trình duyệt là cách dùng chính thức.
        </p>
      </LegalSection>

      <LegalSection title="Shorts là gì?">
        <p>
          Shorts là các video ngắn dạng cuộn dọc (giống TikTok/Reels) trên SoFilm — bạn có thể
          thích, lưu, bình luận và chia sẻ. Xem và tương tác với Shorts yêu cầu đăng nhập.
        </p>
      </LegalSection>

      <LegalSection title="Nội dung có được cập nhật thường xuyên không?">
        <p>
          Có — danh mục phim/series mới được cập nhật liên tục. Trang{" "}
          <a href="/category" className="text-brand hover:underline">
            Categories
          </a>{" "}
          luôn phản ánh danh mục mới nhất theo thể loại.
        </p>
      </LegalSection>

      <LegalSection title="Tôi quên mật khẩu hoặc gặp lỗi khi đăng nhập, liên hệ ai?">
        <p>
          Vui lòng liên hệ đội ngũ hỗ trợ qua email <span className="text-white/90">hello@sofilm.com</span> hoặc
          các kênh mạng xã hội ở cuối trang. Với sự cố liên quan thanh toán, vui lòng kèm theo mã
          tham chiếu giao dịch (hiển thị trên màn hình thanh toán) để được xử lý nhanh hơn.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
