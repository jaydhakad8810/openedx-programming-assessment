from setuptools import find_packages, setup

setup(
    name="openedx-programming-assessment-xblock",
    version="0.1.0",
    description="Programming Assessment XBlock for Open edX",
    packages=find_packages(),
    package_data={
        "programming_assessment": [
            "public/*",
            "public/assets/*",
        ],
    },
    include_package_data=True,
    install_requires=[
        "XBlock>=5.1.0",
        "requests>=2.31.0",
    ],
    entry_points={
        "xblock.v1": [
            "programming_assessment = programming_assessment:ProgrammingAssessmentXBlock",
        ],
    },
)
