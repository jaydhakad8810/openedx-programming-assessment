
import json
from html import escape

from xblock.core import XBlock
from xblock.fields import String, Integer, List, Dict, Scope
from xblock.fragment import Fragment
from xblock.exceptions import JsonHandlerError


class ProgrammingAssessmentXBlock(XBlock):

    display_name = String(
        display_name="Display Name",
        default="Programming Assessment",
        scope=Scope.settings,
    )

    question_title = String(
        display_name="Question Title",
        default="",
        scope=Scope.content,
    )

    question_text = String(
        display_name="Question Description",
        default="",
        scope=Scope.content,
    )

    selected_languages = List(
        display_name="Selected Languages",
        default=["python"],
        scope=Scope.content,
    )

    starter_code = Dict(
        display_name="Starter Code",
        default={
            "python": "def solution():\n    pass\n",
            "java": "public class Main {\n    public static void main(String[] args) {\n    }\n}",
            "cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}",
        },
        scope=Scope.content,
    )

    visible_tests = List(
        display_name="Visible Test Cases",
        default=[],
        scope=Scope.content,
    )

    hidden_tests = List(
        display_name="Hidden Test Cases",
        default=[],
        scope=Scope.content,
    )

    time_limit = Integer(
        display_name="Time Limit (Seconds)",
        default=120,
        scope=Scope.content,
    )

    max_score = Integer(
        display_name="Maximum Marks",
        default=10,
        scope=Scope.content,
    )

    def student_view(self, context=None):
        languages = ", ".join(self.selected_languages or [])

        html = f"""
        <div class="programming-assessment">
            <h2>{escape(self.question_title)}</h2>
            <p>{escape(self.question_text)}</p>
            <p><strong>Maximum Marks:</strong> {self.max_score}</p>
            <p><strong>Time Limit:</strong> {self.time_limit} seconds</p>
            <p><strong>Languages:</strong> {escape(languages)}</p>
            <p>Coding editor integration is pending.</p>
        </div>
        """

        return Fragment(html)

    def studio_view(self, context=None):
        starter_code = json.dumps(self.starter_code, indent=2)
        visible_tests = json.dumps(self.visible_tests, indent=2)
        hidden_tests = json.dumps(self.hidden_tests, indent=2)

        languages = ", ".join(self.selected_languages or [])

        html = f"""
        <div class="programming-assessment-studio">
            <h2>Programming Assessment Configuration</h2>

            <div>
                <label>Question Title</label>
                <input type="text" class="pa-title"
                    value="{escape(self.question_title, quote=True)}">
            </div>

            <div>
                <label>Question Description</label>
                <textarea class="pa-description">{escape(self.question_text)}</textarea>
            </div>

            <div>
                <label>Allowed Languages (python, java, cpp)</label>
                <input type="text" class="pa-languages"
                    value="{escape(languages, quote=True)}">
            </div>

            <div>
                <label>Starter Code (JSON)</label>
                <textarea class="pa-starter-code">{escape(starter_code)}</textarea>
            </div>

            <div>
                <label>Visible Test Cases (JSON)</label>
                <textarea class="pa-visible-tests">{escape(visible_tests)}</textarea>
            </div>

            <div>
                <label>Hidden Test Cases (JSON)</label>
                <textarea class="pa-hidden-tests">{escape(hidden_tests)}</textarea>
            </div>

            <div>
                <label>Time Limit (Seconds)</label>
                <input type="number" class="pa-time-limit"
                    value="{self.time_limit}" min="1">
            </div>

            <div>
                <label>Maximum Marks</label>
                <input type="number" class="pa-max-score"
                    value="{self.max_score}" min="1">
            </div>

            <button type="button" class="pa-save">Save Configuration</button>
            <p class="pa-message" role="status"></p>
        </div>
        """

        js = """
        function ProgrammingAssessmentStudio(runtime, element) {
            var $element = $(element);

            $element.find('.pa-save').on('click', function () {
                var data;

                try {
                    data = {
                        question_title: $element.find('.pa-title').val().trim(),
                        question_text: $element.find('.pa-description').val(),
                        selected_languages: $element.find('.pa-languages').val()
                            .split(',')
                            .map(function (item) { return item.trim().toLowerCase(); })
                            .filter(Boolean),
                        starter_code: JSON.parse($element.find('.pa-starter-code').val()),
                        visible_tests: JSON.parse($element.find('.pa-visible-tests').val()),
                        hidden_tests: JSON.parse($element.find('.pa-hidden-tests').val()),
                        time_limit: Number($element.find('.pa-time-limit').val()),
                        max_score: Number($element.find('.pa-max-score').val())
                    };
                } catch (error) {
                    $element.find('.pa-message').text(
                        'Invalid JSON. Please check starter code and test cases.'
                    );
                    return;
                }

                var url = runtime.handlerUrl(element, 'save_config');

                $element.find('.pa-message').text('Saving...');

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function () {
                        $element.find('.pa-message').text(
                            'Configuration saved successfully.'
                        );
                    },
                    error: function (xhr) {
                        var message = 'Unable to save configuration.';
                        if (xhr.responseText) {
                            message += ' ' + xhr.responseText;
                        }
                        $element.find('.pa-message').text(message);
                    }
                });
            });
        }
        """

        fragment = Fragment(html)
        fragment.add_javascript(js)
        fragment.initialize_js("ProgrammingAssessmentStudio")

        return fragment

    @XBlock.json_handler
    def save_config(self, data, suffix=""):
        required_fields = [
            "question_title",
            "question_text",
            "selected_languages",
            "starter_code",
            "visible_tests",
            "hidden_tests",
            "time_limit",
            "max_score",
        ]

        if not isinstance(data, dict):
            raise JsonHandlerError(400, "Invalid configuration.")

        if any(field not in data for field in required_fields):
            raise JsonHandlerError(400, "Missing configuration fields.")

        title = data["question_title"]
        description = data["question_text"]
        languages = data["selected_languages"]
        starter_code = data["starter_code"]
        visible_tests = data["visible_tests"]
        hidden_tests = data["hidden_tests"]
        time_limit = data["time_limit"]
        max_score = data["max_score"]

        if not isinstance(title, str) or not title.strip():
            raise JsonHandlerError(400, "Question title is required.")

        if not isinstance(description, str) or not description.strip():
            raise JsonHandlerError(400, "Question description is required.")

        if (
            not isinstance(languages, list)
            or not languages
            or any(language not in ("python", "java", "cpp") for language in languages)
            or len(set(languages)) != len(languages)
        ):
            raise JsonHandlerError(400, "Select valid programming languages.")

        if not isinstance(starter_code, dict):
            raise JsonHandlerError(400, "Starter code must be a JSON object.")

        if any(
            language not in starter_code
            or not isinstance(starter_code[language], str)
            for language in languages
        ):
            raise JsonHandlerError(400, "Provide starter code for every selected language.")

        if not isinstance(visible_tests, list) or not isinstance(hidden_tests, list):
            raise JsonHandlerError(400, "Test cases must be JSON arrays.")

        for test in visible_tests + hidden_tests:
            if (
                not isinstance(test, dict)
                or not isinstance(test.get("input"), str)
                or not isinstance(test.get("expectedOutput"), str)
            ):
                raise JsonHandlerError(
                    400,
                    "Each test case must contain input and expectedOutput strings."
                )

        if (
            isinstance(time_limit, bool)
            or not isinstance(time_limit, int)
            or time_limit < 1
        ):
            raise JsonHandlerError(400, "Time limit must be a positive integer.")

        if (
            isinstance(max_score, bool)
            or not isinstance(max_score, int)
            or max_score < 1
        ):
            raise JsonHandlerError(400, "Maximum marks must be a positive integer.")

        # Save validated configuration to XBlock content fields.
        self.question_title = title.strip()
        self.question_text = description
        self.selected_languages = languages
        self.starter_code = starter_code
        self.visible_tests = visible_tests
        self.hidden_tests = hidden_tests
        self.time_limit = time_limit
        self.max_score = max_score

        return {"result": "success"}
