export class AuditReport {

    static show(reportText, sanity) {

        const modal =
            document.getElementById(
                "audit-report-modal"
            );

        const content =
            document.getElementById(
                "audit-report-content"
            );

        content.innerHTML = 

            <div class="space-y-6">

                <div>

                    <div class="text-yellow-400 text-xl font-bold mb-2">
                        RELATÓRIO PSIQUIÁTRICO
                    </div>

                    <div class="text-green-300 whitespace-pre-wrap leading-7">
                        ${reportText}
                    </div>

                </div>

                <div class="border-t border-green-500 pt-4">

                    <span class="text-green-500">
                        SANIDADE REMANESCENTE:
                    </span>

                    <span class="text-white ml-2">
                        ${sanity}%
                    </span>

                </div>

            </div>
        ;

        modal.classList.remove("hidden");
    }

    static hide() {

        document
            .getElementById(
                "audit-report-modal"
            )
            .classList.add(
                "hidden"
            );
    }
}