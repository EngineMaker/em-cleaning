# 仕様書: EngineMaker 掃除管理DX

## 1. 用語定義

| 用語 | 説明 |
| :--- | :--- |
| **ハウス (House)** | 複数のシェアハウスの拠点。`house_id`で管理される。 |
| **住人 (Resident)** | シェアハウスの住人。不変の`resident_id`で管理される。 |
| **部屋 (Room)** | いずれかのハウスに属する物理的な部屋。`room_id`で管理される。 |
| **居住 (Occupancy)** | 住人が特定の部屋にいつからいつまで住んでいるかを表す情報。 |
| **掃除場所 (Cleaning Place)** | いずれかのハウスに属する掃除の対象となる場所（タスク）。 |
| **掃除記録 (Cleaning)** | 「いつ」「誰が」「どこを」掃除したかの記録。 |
| **掃除回 (Cleaning Cycle)** | 掃除を管理する単位。通常は月単位（例: 2023-10）。 |

## 2. データモデル

**単一のGoogle Spreadsheet**をデータベースとして利用する。ファイルIDは環境変数で管理する。
ファイル内は、以下のシート（タブ）に分かれる。シート名は環境変数で変更可能。

### 2.1. `Houses` シート

ハウスのマスタ情報。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `house_id` | `String` | **[PK]** ハウスの不変ID | `house_a` |
| `house_name` | `String` | ハウスの名称 | `EngineMakerハウスA棟` |
| `created_at` | `Timestamp` | 作成日時 | `2023-10-01 09:00:00` |

### 2.2. `Residents` シート

住人のマスタ情報。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `resident_id` | `String` | **[PK]** 住人の不変ID | `res_12345` |
| `name` | `String` | 実名 | `山田 太郎` |
| `nickname` | `String` | ニックネーム | `タロー` |
| `created_at` | `Timestamp` | 作成日時 | `2023-10-01 10:00:00` |

### 2.3. `Rooms` シート

部屋のマスタ情報。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `room_id` | `String` | **[PK]** 部屋の不変ID | `a_101`, `b_d1` |
| `house_id` | `String` | **[FK]** `Houses`シートへの参照 | `house_a` |
| `room_label` | `String` | 表示用の部屋名 | `101号室`, `ドミトリー松` |
| `room_type` | `String` | 部屋の種別 | `個室`, `ドミトリー` |
| `created_at` | `Timestamp` | 作成日時 | `2023-10-01 10:00:00` |

### 2.4. `Occupancies` シート

住人の居住履歴。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `occupancy_id` | `String` | **[PK]** 居住履歴ID | `occ_67890` |
| `resident_id` | `String` | **[FK]** `Residents`シートへの参照 | `res_12345` |
| `room_id` | `String` | **[FK]** `Rooms`シートへの参照 | `a_101` |
| `start_date` | `Date` | 居住開始日 | `2023-04-01` |
| `end_date` | `Date` | 居住終了日（NULL許容） | `2024-03-31` |

### 2.5. `CleaningPlaces` シート

掃除場所のマスタ。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `place_id` | `String` | **[PK]** 掃除場所ID | `a_kit` |
| `house_id` | `String` | **[FK]** `Houses`シートへの参照 | `house_a` |
| `place_name` | `String` | 掃除場所の名称 | `キッチン` |
| `description` | `String` | 補足説明 | `コンロ周り、シンク、床` |

### 2.6. `Cleanings` シート

掃除の実施記録。

| 列名 | 型 | 説明 | 例 |
| :--- | :--- | :--- | :--- |
| `cleaning_id` | `String` | **[PK]** 掃除記録ID | `cln_abcde` |
| `cycle` | `String` | 掃除回（年月） | `2023-10` |
| `place_id` | `String` | **[FK]** `CleaningPlaces`への参照 | `a_kit` |
| `resident_id` | `String` | **[FK]** `Residents`への参照 | `res_12345` |
| `cleaned_at` | `Timestamp` | 掃除実施日時 | `2023-10-15 14:00:00` |

## 3. フォーム仕様

（変更なし）

## 4. Apps Script (GAS) の責務分割

（変更なし）
