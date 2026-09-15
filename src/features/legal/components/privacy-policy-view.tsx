import { LegalPage, LegalSection } from "./legal-page";

export function PrivacyPolicyView() {
  return (
    <LegalPage title="Chính sách quyền riêng tư" updated="15/09/2026">
      <LegalSection title="1. Giới thiệu">
        <p>
          SoFilm (website soaff.ai, sau đây gọi là &quot;SoFilm&quot; hoặc &quot;chúng tôi&quot;)
          là nền tảng xem phim, series và video ngắn (Shorts) trực tuyến, do Công ty Sofin
          Group vận hành. Chính sách quyền riêng tư này giải thích chúng tôi thu thập, sử dụng,
          chia sẻ và bảo vệ thông tin cá nhân của bạn như thế nào khi bạn truy cập và sử dụng
          SoFilm. Bằng việc sử dụng dịch vụ, bạn đồng ý với các nội dung được mô tả dưới đây.
        </p>
      </LegalSection>

      <LegalSection title="2. Đơn vị chịu trách nhiệm">
        <p>
          Công ty Sofin Group
          <br />
          Địa chỉ: 216 - 218 Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng
          <br />
          Email: vietnguyen@sofingroup.com
        </p>
      </LegalSection>

      <LegalSection title="3. Thông tin chúng tôi thu thập">
        <p>Chúng tôi thu thập các nhóm thông tin sau:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="text-white/90">Thông tin tài khoản:</span> họ tên, email hoặc số
            điện thoại, mật khẩu (được mã hoá, không lưu ở dạng văn bản thuần).
          </li>
          <li>
            <span className="text-white/90">Thông tin thanh toán:</span> khi bạn nâng cấp gói
            VIP/Premium, giao dịch được xử lý qua đối tác thanh toán bên thứ ba — SoFilm không
            lưu trữ số thẻ ngân hàng của bạn trên hệ thống của mình.
          </li>
          <li>
            <span className="text-white/90">Dữ liệu sử dụng dịch vụ:</span> phim/series/shorts
            đã xem, danh sách yêu thích, lịch sử tìm kiếm, lượt thích/lưu/bình luận.
          </li>
          <li>
            <span className="text-white/90">Dữ liệu thiết bị &amp; nhật ký kỹ thuật:</span> địa
            chỉ IP, loại thiết bị, trình duyệt, hệ điều hành, thời gian truy cập.
          </li>
          <li>
            <span className="text-white/90">Cookie và công nghệ tương tự:</span> dùng để ghi
            nhớ phiên đăng nhập, tuỳ chọn giao diện, và phục vụ quảng cáo (xem mục 5).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Mục đích sử dụng thông tin">
        <p>Thông tin thu thập được dùng để:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Cung cấp, duy trì và vận hành dịch vụ streaming.</li>
          <li>Cá nhân hoá gợi ý nội dung phù hợp với sở thích của bạn.</li>
          <li>Xử lý thanh toán và quản lý gói đăng ký VIP/Premium.</li>
          <li>Hỗ trợ, chăm sóc khách hàng và xử lý khiếu nại.</li>
          <li>Phát hiện, ngăn chặn gian lận và bảo đảm an toàn hệ thống.</li>
          <li>Đo lường, phân tích và cải thiện chất lượng dịch vụ.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cookie và quảng cáo của bên thứ ba">
        <p>
          SoFilm sử dụng Google AdSense để hiển thị quảng cáo giúp duy trì phần nội dung miễn
          phí trên nền tảng. Google và các đối tác quảng cáo của Google có thể sử dụng cookie
          (bao gồm cookie DART) để phục vụ quảng cáo dựa trên lượt truy cập trước đó của bạn
          vào SoFilm hoặc các website khác trên Internet.
        </p>
        <p>
          Bạn có thể tắt việc cá nhân hoá quảng cáo bằng cách truy cập{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Cài đặt quảng cáo của Google
          </a>{" "}
          hoặc{" "}
          <a
            href="https://www.aboutads.info/choices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            www.aboutads.info/choices
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Chia sẻ thông tin với bên thứ ba">
        <p>
          SoFilm không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin với: đối
          tác xử lý thanh toán (để hoàn tất giao dịch), nhà cung cấp hạ tầng/lưu trữ kỹ thuật,
          đối tác quảng cáo (Google AdSense, ở dạng dữ liệu tổng hợp/ẩn danh khi có thể), và cơ
          quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp theo quy định pháp luật.
        </p>
      </LegalSection>

      <LegalSection title="7. Bảo mật dữ liệu">
        <p>
          Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý (mã hoá mật khẩu, giới hạn
          quyền truy cập nội bộ) để bảo vệ thông tin của bạn. Tuy nhiên, không có phương thức
          truyền tải hoặc lưu trữ dữ liệu nào là an toàn tuyệt đối 100%.
        </p>
      </LegalSection>

      <LegalSection title="8. Thời gian lưu trữ">
        <p>
          Thông tin của bạn được lưu trữ trong suốt thời gian tài khoản còn hoạt động và trong
          khoảng thời gian cần thiết để tuân thủ nghĩa vụ pháp lý. Khi không còn cần thiết cho
          các mục đích trên, dữ liệu sẽ được xoá hoặc ẩn danh hoá.
        </p>
      </LegalSection>

      <LegalSection title="9. Quyền của bạn">
        <p>
          Bạn có quyền yêu cầu truy cập, chỉnh sửa, hoặc xoá thông tin cá nhân, cũng như rút lại
          sự đồng ý cho việc xử lý dữ liệu bất kỳ lúc nào. Để thực hiện các quyền này, vui lòng
          liên hệ vietnguyen@sofingroup.com.
        </p>
      </LegalSection>

      <LegalSection title="10. Đối với trẻ em">
        <p>
          SoFilm không hướng đến và không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13
          tuổi. Nếu phát hiện dữ liệu như vậy được thu thập ngoài ý muốn, chúng tôi sẽ xoá bỏ
          ngay khi biết được.
        </p>
      </LegalSection>

      <LegalSection title="11. Thay đổi chính sách">
        <p>
          Chính sách này có thể được cập nhật theo thời gian. Mọi thay đổi sẽ được đăng tải trên
          trang này kèm ngày cập nhật mới ở đầu trang.
        </p>
      </LegalSection>

      <LegalSection title="12. Liên hệ">
        <p>
          Nếu có bất kỳ câu hỏi nào về chính sách quyền riêng tư này, vui lòng liên hệ:
          <br />
          Công ty Sofin Group
          <br />
          Địa chỉ: 216 - 218 Trần Hưng Đạo, P. An Hải, TP. Đà Nẵng
          <br />
          Email: vietnguyen@sofingroup.com
        </p>
      </LegalSection>
    </LegalPage>
  );
}
