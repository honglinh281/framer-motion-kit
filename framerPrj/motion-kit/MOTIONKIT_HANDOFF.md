# MotionKit Handoff

## 1. Mục tiêu sản phẩm

MotionKit là một Framer plugin dành cho người mới, giúp họ chọn sẵn các motion/effect thay vì phải tự cấu hình animation thủ công.

Ý tưởng cốt lõi đã chốt:

- plugin không nên ôm toàn bộ runtime effect bên trong chính `plugin.zip`
- effect nên được phân làm 2 kiểu tích hợp:
  - `Direct Apply`: plugin sửa trực tiếp layer đang chọn
  - `Insert Effect`: plugin chèn effect dưới dạng component/code component

## 2. Trạng thái hiện tại

Project đang dùng để tiếp tục làm việc là:

- `/Users/admin/Documents/New project/framerPrj/motion-kit`

Project cũ/prototype vẫn còn trong:

- `/Users/admin/Documents/New project/framerPlugin`

Có thể bỏ qua `framerPlugin/` nếu chỉ muốn tiếp tục trên cây mới.

## 3. Kiến trúc hiện tại

### Cấu trúc chính

- `src/`: plugin UI, selection logic, apply pipeline
- `packages/shared-types`: schema/type chung cho effect
- `packages/effect-catalog`: local catalog của effect
- `docs/`: notes về architecture, authoring, release
- `registry/`: ví dụ quản lý module URL cho shared Framer components

### Decision đã chốt

- `Direct Apply` dùng cho native/simple presets
- `Insert Effect` dùng cho Smart Component / Code Component / generated component
- plugin có thể đọc catalog local ngay bây giờ, và đã có hook để sau này đổi sang remote manifest

## 4. Những gì đã implement

### Plugin UI

Đã refactor UI theo hướng tool-first:

- bỏ intro lớn chiếm chỗ
- có top bar gọn
- có selection strip gọn
- có `Catalog & integration modes` dạng `details` có thể collapse
- effect list chiếm phần lớn diện tích
- mỗi card có:
  - preview
  - name
  - summary
  - delivery mode
  - implementation type
  - target pills
  - `Details`
  - `Apply`

### Effect modes

Đã thêm `deliveryMode` vào schema:

- `direct-apply`
- `insert-effect`

### Catalog

Hiện trong catalog có cả 2 nhóm:

- Direct apply:
  - `Appear Direct`
  - `Blur Fade In`
  - `Scroll Reveal Up`
- Insert effect:
  - `Appear Inserted`
  - `Parallax Depth`
  - `Slide Stack`
  - `Pixel Scroll`
  - `Hover Distortion`

### Generated effect

`Appear Inserted` không cần library publish trước.

Flow:

- plugin tạo code file `MotionKitAppear.tsx` trong chính project Framer
- lấy `insertURL`
- chèn component instance lên canvas

File chính:

- `src/lib/generated-appear.ts`

## 5. Vấn đề đang xử lý / chưa chốt

### A. `Appear Direct` từng bị lỗi apply

Nguyên nhân nghi ngờ:

- direct path ban đầu gọi cả `setAttributes` lẫn `setPluginData`
- `Node.setPluginData` là permission riêng
- có thể làm plugin báo lỗi dù mutate chính đã xong hoặc bị chặn giữa chừng

Đã sửa theo hướng:

- direct apply chỉ cần `Node.setAttributes`
- chỉ ghi plugin data nếu Framer cho phép
- thêm check `framer.isAllowedTo("Node.setAttributes")`

Nhưng **chưa có xác nhận cuối cùng từ user rằng lỗi đã hết**.

### B. Giới hạn platform

Điểm quan trọng đã xác nhận trong quá trình làm:

- Framer plugin có thể sửa node trực tiếp qua `Node.setAttributes`
- nhưng không có flow sạch kiểu:
  - `select any frame`
  - `wrap frame đó vào code component`
  - `giữ nguyên toàn bộ children/content`
  - `gắn advanced runtime effect trực tiếp`

Vì vậy:

- simple effect => direct apply
- advanced effect => insert/replace/hide/wrap giả lập

### C. Placeholder module URLs

Các effect kiểu shared component/code component trong catalog vẫn đang dùng placeholder URLs.

Muốn chúng hoạt động thật thì cần:

1. publish component trong Framer library
2. copy `moduleUrl`
3. thay vào `packages/effect-catalog/src/catalog.json`

Riêng `Appear Inserted` thì không phụ thuộc bước này vì nó generate component local.

## 6. File quan trọng để đọc trước

### Entry points

- `src/App.tsx`
- `src/App.css`

### Effect pipeline

- `src/lib/apply-effect.ts`
- `src/lib/generated-appear.ts`
- `src/lib/catalog.ts`
- `src/lib/selection.ts`

### UI pieces

- `src/components/EffectCard.tsx`
- `src/components/SelectionSummary.tsx`

### Schema + data

- `packages/shared-types/src/index.ts`
- `packages/effect-catalog/src/catalog.json`
- `packages/effect-catalog/src/index.ts`

### Docs

- `README.md`
- `docs/architecture.md`
- `docs/effect-authoring.md`
- `docs/release-flow.md`

## 7. Những gì đã verify

Trong `framerPrj/motion-kit` đã chạy thành công:

- `npm install`
- `npm run build`
- `npm run lint`

Lưu ý:

- build/lint pass không đồng nghĩa direct apply đã chắc chắn hoạt động đúng trong Framer runtime
- cần test trực tiếp trong Framer editor

## 8. Hướng tiếp theo hợp lý

Ưu tiên tiếp theo nên là:

1. xác nhận `Appear Direct` có apply được thật trong Framer hay không
2. nếu vẫn fail, log rõ lỗi runtime/toast exact string
3. nếu direct apply chỉ thay opacity là quá yếu, đổi sang một direct preset nhìn rõ hơn nhưng vẫn nằm trong giới hạn `setAttributes`
4. map `moduleUrl` thật cho 1-2 insert effects để test luồng library-based
5. tiếp tục polish UI nếu còn bug layout trong panel hẹp

## 9. Bối cảnh UX gần nhất

User phản hồi rằng UI cũ:

- phần giới thiệu quá to
- phần effect list quá nhỏ
- phải scroll nhiều
- card effect không hiển thị đủ thông tin
- có bug layout khiến card bị lệch và nút `Apply` stretch sai

Đã có một vòng sửa UI theo hướng compact.

Nếu tiếp tục, nên kiểm tra:

- panel width thực tế trong Framer
- card overflow khi summary dài
- action row khi width hẹp
- behavior của `Details` expanded/collapsed

## 10. Prompt ngắn để tiếp tục

Nếu đưa file này cho Codex khác, prompt tốt sẽ là:

> Đọc `MOTIONKIT_HANDOFF.md` trong `framerPrj/motion-kit`, tiếp tục từ đó. Ưu tiên debug `Appear Direct` cho chạy được thật trong Framer editor, sau đó polish UI nếu cần.

