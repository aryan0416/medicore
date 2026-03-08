CREATE TYPE "public"."invoice_status" AS ENUM('Paid', 'Pending', 'Overdue');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('Credit Card', 'Bank Transfer', 'Cash', 'Insurance');--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "invoice_status" DEFAULT 'Pending' NOT NULL,
	"due_date" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"patient_id" uuid NOT NULL,
	"invoice_id" varchar(50),
	"amount" numeric(10, 2) NOT NULL,
	"method" "payment_method" NOT NULL,
	"reference" varchar(150),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;