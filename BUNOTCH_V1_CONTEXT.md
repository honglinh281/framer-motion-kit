# Bunotch V1 Context

## User Prompt To Continue From

Tôi đang xây dựng Bunotch, một macOS notch utility app với character bunny làm trung tâm trải nghiệm. Ở giai đoạn hiện tại, v1 chỉ bao gồm 4 feature:

1. Eye Tracking
2. App Count Time
3. Media Control
4. Thời tiết khu vực

Các ràng buộc và yêu cầu đã chốt:

- `App Count Time` chỉ count time của các app `foreground`, không tính app chạy ngầm.
- `Media Control` cần có một khoảng nhỏ xíu để hiển thị `audio visualizer`.
- `Weather` sẽ yêu cầu quyền truy cập vị trí từ người dùng.
- Nếu người dùng cho phép truy cập vị trí thì hiển thị thông tin thời tiết cơ bản kèm hình ảnh character bunny với các `status tĩnh` theo từng dạng thời tiết.
- Nếu người dùng không cho phép truy cập vị trí thì `không hiển thị weather nữa`.
- `Eye Tracking` dùng character bunny đã thiết kế sẵn, và muốn dùng mouse tracking để chuyển động con mắt.
- Ưu tiên cao nhất của v1: `hiệu năng tốt`, `độ chính xác cao`, `animation mượt`, `kiến trúc thực dụng`, không over-engineer.

Yêu cầu cho Codex:

- Đọc file này như context chính.
- Giữ nguyên các quyết định đã chốt bên dưới.
- Khi đề xuất kiến trúc hoặc code, ưu tiên stack tối ưu cho macOS notch app.
- Không mở rộng scope sang các feature cũ như blocking, meeting, reminder, pomodoro, battery monitoring.

## Product Context

Bunotch là một macOS notch bar app với bunny character đóng vai trò như lớp giao diện sống trên vùng notch. Bản v1 đã được cắt scope mạnh để tập trung vào 4 feature có ích và đủ khác biệt:

- Eye Tracking để tạo bản sắc character.
- App Count Time để tạo utility cốt lõi.
- Media Control để tăng tính dùng hàng ngày.
- Weather để bổ sung ambient context cho notch.

## Final V1 Scope

- Eye Tracking
- App Count Time
- Media Control
- Weather theo vị trí người dùng

## Decisions Already Locked

### 1. App Count Time

- Chỉ tính thời gian của app đang ở `foreground`.
- Không tính app chạy nền.
- Không cố giải bài toán app background semantics trong v1.
- Hướng đánh giá kỹ thuật trước đó đã được xác nhận là đúng ý người dùng.

### 2. Media Control

- Có một vùng rất nhỏ để hiển thị `audio visualizer`.
- V1 không cần waveform/audio analysis thật từ raw audio nếu có phương án nhẹ hơn.

### 3. Weather

- Weather phụ thuộc vào quyền truy cập vị trí.
- Nếu user cho phép location access:
  - Hiển thị thông tin thời tiết cơ bản.
  - Hiển thị bunny status tĩnh theo loại thời tiết.
- Nếu user không cho phép location access:
  - Không hiển thị weather.
- Không có animation weather trong v1.

### 4. Eye Tracking

- Dùng character bunny đã có sẵn.
- Mouse tracking điều khiển chuyển động mắt.
- Ưu tiên stack cho:
  - hiệu năng
  - độ chính xác
  - animation mượt

## Technical Assessment Already Made

### Recommended Stack

Stack được khuyến nghị cho v1:

- `AppKit` cho shell macOS, notch overlay/window behavior, hệ thống event và integration native.
- `SwiftUI` cho layout, state-driven composition, settings, panel phụ.
- `Core Animation` cho eye tracking pupil movement và visualizer nhỏ.

Lý do:

- `AppKit` phù hợp hơn `SwiftUI-only` cho app dạng notch utility trên macOS.
- `Core Animation` cho phép animate layer rẻ hơn và mượt hơn so với redraw cả view tree.
- `SwiftUI` vẫn hữu ích cho phần UI cấu trúc và maintainability.

### Eye Tracking Recommendation

Không nên dùng một ảnh phẳng duy nhất rồi redraw liên tục.

Nên tách character thành các layer/asset riêng:

- base bunny head
- left eye white
- right eye white
- left pupil
- right pupil

Implementation direction:

- Lấy vị trí chuột global bằng `NSEvent.mouseLocation`.
- Convert về local coordinates của notch view.
- Tính vector từ tâm mỗi mắt tới vị trí chuột.
- Clamp pupil movement trong một ellipse nhỏ cho từng mắt.
- Animate pupil bằng `CALayer.position` hoặc spring/easing nhẹ.

Điều nên tránh:

- redraw toàn bộ character mỗi frame
- Canvas redraw liên tục cho cả view
- compositing lại toàn bộ NSImage ở tần số cao

### Media Visualizer Recommendation

V1 không nên render waveform thật từ audio buffer.

Nên dùng `procedural visualizer`:

- 3-5 bar nhỏ
- animate theo playback state
- khi phát thì bar chuyển động theo pattern procedural
- khi pause thì bar đứng yên hoặc hạ xuống

Render direction:

- dùng `CALayer` hoặc `CAShapeLayer`
- animate `transform.scale.y`
- stagger phase giữa các bar

Mục tiêu:

- nhìn như audio visualizer
- rất nhẹ
- không phụ thuộc vào raw audio analysis

### Weather Recommendation

Hướng kỹ thuật:

- `CoreLocation` để xin location permission
- weather service layer riêng
- cache dữ liệu theo chu kỳ, ví dụ 15-30 phút
- mapping từ loại thời tiết sang bunny status tĩnh

Policy đã khuyến nghị:

- chỉ show weather khi `authorization == authorized`
- denied thì không show weather trong notch
- không refetch quá thường xuyên

### App Count Time Recommendation

Hướng kỹ thuật v1:

- dùng `NSWorkspace.didActivateApplicationNotification` để detect app switch
- giữ current foreground app
- kết hợp idle detection để tránh cộng thời gian khi user rời máy
- chỉ cộng thời gian cho foreground app nếu user đang active

Tinh thần implementation:

- simple
- heuristic rõ ràng
- không cố đạt "perfect truth"

## Risk Notes

Các rủi ro cần tiếp tục để ý:

- state coordination giữa 4 feature trong notch nhỏ
- không để visualizer và eye tracking gây CPU spike
- media metadata có thể không đồng nhất giữa các source
- weather phụ thuộc permission và external data source
- app count time cần chấp nhận là heuristic, không phải tracking tuyệt đối

## What Not To Add In V1

Không mở rộng lại sang:

- App Blocking
- Calendar / Meeting
- Reminder
- Pomodoro
- Timer
- Battery / Bunotch Connect
- Hard Interrupt overlay

## Suggested Next Work

1. Chốt kiến trúc module cho 4 feature.
2. Chốt format asset cho bunny để phục vụ eye tracking.
3. Thiết kế notch state/display policy khi nhiều feature cùng active.
4. Prototype eye tracking bằng AppKit + Core Animation.
5. Prototype mini visualizer bằng layer animation.

## Original Conversation Summary

Trong cuộc trao đổi trước đó, các kết luận chính là:

- Scope ban đầu của PRD quá rộng.
- Sau khi cắt xuống còn Eye Tracking + App Count Time + Media Control + Weather thì v1 trở nên khả thi hơn nhiều.
- App Count Time theo hướng foreground-only là đúng intent của người dùng.
- Media visualizer nên đi theo hướng procedural thay vì waveform thật.
- Weather chỉ nên hiển thị khi có location permission.
- Eye tracking nên ưu tiên `AppKit + Core Animation`, SwiftUI chỉ nên là lớp UI composition bên ngoài.
