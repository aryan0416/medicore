CREATE TABLE "clinical_note_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinical_note_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"subjective" text,
	"objective" text,
	"assessment" text,
	"plan" text,
	"changed_by" uuid NOT NULL,
	"reason_for_change" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "status" SET DEFAULT 'waiting'::text;--> statement-breakpoint
DROP TYPE "public"."encounter_status";--> statement-breakpoint
CREATE TYPE "public"."encounter_status" AS ENUM('waiting', 'in_consultation', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "status" SET DEFAULT 'waiting'::"public"."encounter_status";--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "status" SET DATA TYPE "public"."encounter_status" USING "status"::"public"."encounter_status";--> statement-breakpoint
ALTER TABLE "encounters" ALTER COLUMN "doctor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clinical_notes" ADD COLUMN "current_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "clinical_note_versions" ADD CONSTRAINT "clinical_note_versions_clinical_note_id_clinical_notes_id_fk" FOREIGN KEY ("clinical_note_id") REFERENCES "public"."clinical_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_note_versions" ADD CONSTRAINT "clinical_note_versions_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;